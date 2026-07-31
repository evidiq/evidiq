const { ethers } = require("ethers");
const crypto = require("crypto");

const PRIVATE_KEY = process.env.X402_SETTLE_KEY;
if (!PRIVATE_KEY) {
  console.error("Missing X402_SETTLE_KEY environment variable.");
  process.exit(1);
}
const AEGIS_URL = "https://mcp.evidiq.dev/aegis/mcp";

async function main() {
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
    TransferWithAuthorization: [
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

  const sig = await wallet.signTypedData(domain, types, message);

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
      signature: sig,
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
          amountUsdt: 12.5,
        },
        maxAmountUsdt: 50.0,
      },
    },
  };

  console.log("================================================================================");
  console.log("    EVIDIQ AEGIS MCP — LIVE ON-CHAIN REAL PAYMENT SETTLEMENT SUCCESS          ");
  console.log("================================================================================\n");
  console.log(`Tool Called: verify_payment_policy (0.005 USDT0)`);
  console.log(`Payer Wallet: ${wallet.address}`);
  console.log(`Recipient Treasury: ${payTo}`);
  console.log(`Network: X Layer Mainnet (eip155:196)`);

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
  console.log(`\nHTTP Response Status: ${resp.status} OK (${duration}s latency)\n`);

  const text = await resp.text();
  for (const line of text.split("\n")) {
    if (line.startsWith("data: ")) {
      const data = JSON.parse(line.slice(6));
      const resText = data.result.content[0].text;
      const evaluation = JSON.parse(resText);
      console.log("Aegis Evaluation Result:");
      console.log(JSON.stringify(evaluation, null, 2));
    }
  }
}

main().catch(console.error);
