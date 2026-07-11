import { keccak256, stringToBytes } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { Attestation, TrustReport } from "@/lib/trust/types";
import { canonicalReport } from "@/lib/trust/score";
import { getOgConfig } from "./config";
import { uploadJson } from "./storage";

/**
 * EVIDIQ Verification & Proof layer (layer 3).
 *
 * Turns a Trust Report into a verifiable, tamper-evident attestation:
 *  1. hash the canonical report (keccak256),
 *  2. anchor the full evidence on 0G Storage (returns a merkle root),
 *  3. sign the verdict with the EVIDIQ key (EIP-191) so anyone can recover the
 *     attester and confirm the score was not altered.
 *
 * When the report carries a TEE-verified AI analysis (0G Compute router), the
 * method is upgraded to "0g-tee" and the on-chain provider + request id are
 * recorded as the compute attestation trace. Never throws — a paid trust check
 * still returns a report even if 0G is unreachable.
 */
export async function attestReport(report: TrustReport): Promise<Attestation> {
  const canonical = canonicalReport(report);
  const reportHash = keccak256(stringToBytes(canonical));

  const tee = report.analysis?.teeVerified
    ? {
        model: report.analysis.model,
        provider: report.analysis.provider,
        requestId: report.analysis.requestId,
        verified: true,
      }
    : undefined;

  const cfg = getOgConfig();
  if (!cfg) {
    return {
      method: tee ? "0g-tee" : "unsigned",
      reportHash,
      tee,
      note: "OG_PRIVATE_KEY not configured — evidence not anchored and verdict not signed.",
    };
  }

  // 1. Anchor evidence on 0G Storage (best-effort).
  let storageRoot: string | undefined;
  let storageTx: string | undefined;
  let storageNote: string | undefined;
  try {
    const stored = await uploadJson(
      cfg,
      { reportHash, report },
      `evidiq-${report.agentId}.json`
    );
    if (stored.ok) {
      storageRoot = stored.root;
      storageTx = stored.tx;
    } else {
      storageNote = `0G Storage anchoring skipped: ${stored.error}`;
    }
  } catch (err) {
    storageNote = `0G Storage anchoring error: ${(err as Error).message}`;
  }

  // 2. Sign the verdict with the EVIDIQ key.
  try {
    const account = privateKeyToAccount(cfg.privateKey);
    const message = attestationMessage(report, reportHash, storageRoot);
    const signature = await account.signMessage({ message });
    return {
      method: tee ? "0g-tee" : "evidiq-eip191",
      reportHash,
      signature,
      attester: account.address,
      storageRoot,
      storageTx,
      tee,
      note: storageNote,
    };
  } catch (err) {
    return {
      method: tee ? "0g-tee" : "unsigned",
      reportHash,
      storageRoot,
      storageTx,
      tee,
      note: `signing failed: ${(err as Error).message}${storageNote ? ` | ${storageNote}` : ""}`,
    };
  }
}

/** The canonical, human+machine readable string that gets signed. */
function attestationMessage(
  report: TrustReport,
  reportHash: string,
  storageRoot?: string
): string {
  return [
    "EVIDIQ Trust Attestation v1",
    `agent: ${report.agentId}`,
    `score: ${report.trustScore}`,
    `tier: ${report.tier}`,
    `recommendation: ${report.recommendation}`,
    `reportHash: ${reportHash}`,
    `storageRoot: ${storageRoot ?? "none"}`,
    `tee: ${report.analysis?.teeVerified ? `${report.analysis.model}@${report.analysis.provider ?? "0g"}` : "none"}`,
    `issuedAt: ${report.issuedAt}`,
  ].join("\n");
}
