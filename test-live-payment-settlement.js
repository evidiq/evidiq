const { ethers } = require("ethers");
const crypto = require("crypto");

const PRIVATE_KEY = "REDACTED-LEAKED-KEY-PURGED";
const AEGIS_URL = "https://mcp.evidiq.dev/aegis/mcp";

async function testVariant(typeString, isSplitSig) {
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const payTo = "0x2a8efe3093278bb4bd3b2d9c7b5ba992ca4fc9b0";
  const amount = "5000"; // 0.005 USDT0
  const asset = "0x779ded0c9e1022225f8e0630b35a9b54be713736";
  const now = Math.floor(Date.now() / 1000);
  const validAfter = "0";
  const validBefore = String(now + 3600);
  const nonce = "0x" + crypto.randomBytes(32).toString("hex");

  const domain = {
    name: "USD₮0",
    version: "1",
    chainId: 196,
    verifyingContract: asset,
  };

  const types = {
    [typeString]: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  };

  const message = {
    from: wallet.address,
    to: payTo,
    value: amount,
    validAfter: validAfter,
    validBefore: validBefore,
    nonce: nonce,
  };

  const rawSig = await wallet.signTypedData(domain, types, message);
  let sigPayload = rawSig;
  if (isSplitSig) {
    const sigSplit = ethers.Signature.from(rawSig);
    sigPayload = { v: sigSplit.v, r: sigSplit.r, s: sigSplit.s };
  }

  const envelope = {
    x402Version: 2,
    accepted: {
      scheme: "exact",
      network: "eip155:196",
      asset: asset,
      amount: amount,
      payTo: payTo,
      maxTimeoutSeconds: 300,
      extra: {
        name: "USD₮0",
        version: "1",
      },
    },
    payload: {
      signature: sigPayload,
      authorization: {
        from: wallet.address,
        to: payTo,
        value: amount,
        validAfter: validAfter,
        validBefore: validBefore,
        nonce: nonce,
      },
    },
  };

  const paymentHeader = Buffer.from(JSON.stringify(envelope)).toString("base64");

  const body = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name: "verify_payment_policy",
      arguments: {
        payload: {
          payTo: "0x2a8efe3093278bb4bd3b2d9c7b5ba992ca4fc9b0",
          amountUsdt: 10.0,
        },
        maxAmountUsdt: 50.0,
      },
    },
  };

  const start = Date.now();
  const resp = await fetch(AEGIS_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json, text/event-stream",
      "payment-signature": paymentHeader,
    },
    body: JSON.stringify(body),
  });

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  const text = await resp.text();
  console.log(`Variant: ${typeString} (splitSig=${isSplitSig}) -> Status ${resp.status} (${duration}s):`);
  console.log(`  Output: ${text.slice(0, 150)}`);
}

async function main() {
  console.log("Testing typed data variants against OKX Facilitator SDK on VPS...");
  await testVariant("TransferWithAuthorization", false);
  await testVariant("TransferWithAuthorization", true);
  await testVariant("ReceiveWithAuthorization", false);
  await testVariant("ReceiveWithAuthorization", true);
}

main().catch(console.error);
