// TEMP: fund a reviewer wallet with USDT0 from the settler (raw-key) wallet on X Layer.
// Usage: node scripts/fund-reviewer.mjs <toAddress> [amountHuman=0.05]
// Reads the settler key from ~/.evidiq-x402-test-wallet.json. Never prints the key.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createWalletClient, createPublicClient, http, parseUnits, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC = process.env.XLAYER_RPC || "https://rpc.xlayer.tech";
const USDT0 = "0x779ded0c9e1022225f8e0630b35a9b54be713736";
const EXPECTED_SETTLER = "0xd6B658dC6e53444bF9Cba598aFdd21Ede0A62Fb9".toLowerCase();

const TO = process.argv[2];
const AMT = process.argv[3] || "0.05";
if (!TO || !/^0x[0-9a-fA-F]{40}$/.test(TO)) {
  console.error("usage: node scripts/fund-reviewer.mjs <toAddress> [amountHuman]");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(join(homedir(), ".evidiq-x402-test-wallet.json"), "utf8"));
const pkRaw = raw.privateKey || raw.private_key || raw.key || raw.pk || raw.secretKey;
if (!pkRaw) {
  console.error("no private-key field found; file keys =", Object.keys(raw).join(","));
  process.exit(1);
}
const pk = pkRaw.startsWith("0x") ? pkRaw : "0x" + pkRaw;
const account = privateKeyToAccount(pk);
console.log("settler:", account.address);
if (account.address.toLowerCase() !== EXPECTED_SETTLER) {
  console.error("ABORT: wallet file address != expected settler 0xd6B658…; refusing to send.");
  process.exit(1);
}

const chain = defineChain({
  id: 196,
  name: "X Layer",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: { default: { http: [RPC] } },
});
const pub = createPublicClient({ chain, transport: http(RPC) });
const wc = createWalletClient({ account, chain, transport: http(RPC) });
const erc20 = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "a", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "v", type: "uint256" }], outputs: [{ type: "bool" }] },
];

const [okb, usdt] = await Promise.all([
  pub.getBalance({ address: account.address }),
  pub.readContract({ address: USDT0, abi: erc20, functionName: "balanceOf", args: [account.address] }),
]);
console.log("OKB(gas) wei:", okb.toString(), "| USDT0 minimal:", usdt.toString());

const value = parseUnits(AMT, 6);
if (usdt < value) { console.error(`insufficient USDT0: have ${usdt}, need ${value}`); process.exit(1); }
if (okb === 0n) { console.error("no OKB for gas on X Layer"); process.exit(1); }

console.log(`sending ${AMT} USDT0 -> ${TO} ...`);
const hash = await wc.writeContract({ address: USDT0, abi: erc20, functionName: "transfer", args: [TO, value] });
console.log("tx:", hash);
const rcpt = await pub.waitForTransactionReceipt({ hash, timeout: 120_000 });
console.log("status:", rcpt.status, "block:", rcpt.blockNumber.toString());
