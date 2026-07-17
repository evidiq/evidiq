/**
 * Blog topic registry for EVIDIQ auto-blog.
 * Every topic is genuinely ABOUT EVIDIQ (what it is, why it exists, how it
 * works) — not generic "AI agents" filler. Keywords are chosen for what
 * builders in the agent-economy / x402 / OKX.AI / MCP space actually search.
 * The scheduler rotates through these (round-robin by lastUsedAt) so the same
 * topic isn't repeated back-to-back.
 *
 * `outline` is the topic's OWN section skeleton (3-6 H2 headings, each with a
 * one-line brief of what goes under it). This is deliberate: earlier drafts
 * forced every topic through the SAME six headings ("What Is X? / The
 * Problem EVIDIQ Solves / How It Works / What You Get / Where This Is
 * Headed / FAQ"), so every article ended up structurally identical — just
 * reworded. Giving each topic its own outline is what makes the articles
 * actually read as distinct pieces, not one template re-skinned twelve times.
 * Only the FAQ section (added separately by the generator) is universal.
 */

export interface OutlineSection {
  heading: string;
  brief: string;
}

export interface TopicDef {
  id: string;
  keyword: string;
  title: string;
  angle: string;
  category: string;
  outline: OutlineSection[];
}

export const SEED_TOPICS: TopicDef[] = [
  {
    id: "what-is-evidiq",
    keyword: "trust layer for AI agents",
    title: "EVIDIQ: The Trust Layer for AI Agents Before Money Moves",
    angle:
      "Define EVIDIQ precisely (verify -> score -> attest) and walk through one real verify_agent call end to end, from cold request to signed Trust Report.",
    category: "EVIDIQ",
    outline: [
      { heading: "What Is a Trust Layer for AI Agents?", brief: "Featured-snippet definition naming EVIDIQ; distinguish 'trust layer' from identity, payments, or compute layers it sits alongside." },
      { heading: "One Call, Start to Finish", brief: "Narrate a single verify_agent request literally: the JSON-RPC call in, the 402 if unpaid, the signed report out. Use a concrete fictional agent name and address." },
      { heading: "The Three Questions Every Trust Layer Has to Answer", brief: "Identity ('who is this'), capability ('can they do it'), reputation ('have they done it before') — and why bundling all three into one score beats checking any one alone." },
      { heading: "What a Trust Layer Is Not", brief: "Not an escrow, not a KYC provider, not a guarantee. Be blunt about the boundary — EVIDIQ hands you evidence, not a promise." },
    ],
  },
  {
    id: "why-agents-need-trust-layer",
    keyword: "AI agent trust deficit",
    title: "Why AI Agents Need a Trust Layer Like EVIDIQ Right Now",
    angle:
      "The concrete failure mode: an autonomous agent paying or hiring another agent with no way to verify identity, capability, or history.",
    category: "Agent Economy",
    outline: [
      { heading: "The 3 A.M. Problem", brief: "A specific scenario: an unattended agent gets a job offer / invoice from an unfamiliar counterparty at an odd hour and has seconds to decide. Featured-snippet definition of 'AI agent trust deficit' embedded here." },
      { heading: "Why Wallet Balance Is a Terrible Trust Signal", brief: "Debunk the naive heuristics agents fall back on today — balance, domain age, a self-reported ENS name — and why each one is trivially gameable." },
      { heading: "What Changes When EVIDIQ Is in the Loop", brief: "Same scenario, replayed with a verify_agent call inserted before the payment — what specifically the agent sees differently and why it changes the outcome." },
      { heading: "This Isn't a Human Problem With an AI Costume On", brief: "Why human due-diligence habits (read a review, check LinkedIn) don't transfer to machine speed, and what has to replace them structurally." },
    ],
  },
  {
    id: "evidiq-x402-mcp-how",
    keyword: "x402 pay-per-call MCP server",
    title: "How EVIDIQ's x402 Pay-Per-Call MCP Server Actually Works",
    angle:
      "Technical walkthrough of the wire protocol: the /mcp endpoint, the 402 challenge, EIP-3009 signing, settlement, and the report coming back.",
    category: "x402",
    outline: [
      { heading: "The Wire Protocol, Byte by Byte", brief: "Featured-snippet definition of an x402 pay-per-call MCP server. Then the exact sequence: POST to /mcp, get 402 with accepts[], sign, retry with the payment header." },
      { heading: "Reading an accepts[] Object", brief: "Break down the real fields — scheme, network, amount, asset, payTo, extra.name/version — field by field, with what happens if a client gets one wrong." },
      { heading: "EIP-3009 Without the Cryptography Lecture", brief: "Plain explanation of transferWithAuthorization and why it lets the payer sign without paying gas, tied directly to how EVIDIQ's settler executes it." },
      { heading: "What Happens on a Bad Signature or Late Nonce", brief: "The failure paths — expired validBefore, reused nonce, wrong domain separator — and what error each one produces, so an integrator can debug their own client." },
    ],
  },
  {
    id: "evidiq-trust-report-explained",
    keyword: "AI agent trust score",
    title: "Inside the EVIDIQ Trust Report: How the 0-100 Score Really Works",
    angle:
      "Break down the deterministic scoring formula and what each finding code means — treat this as a spec walkthrough, not a sales pitch.",
    category: "EVIDIQ",
    outline: [
      { heading: "The Formula, in Full", brief: "Featured-snippet: state the exact weighted formula. Then show it computed for two contrasting example agents side by side — one that scores high, one that scores low — with the arithmetic shown." },
      { heading: "Why Four Dimensions and Not One Number You Just Trust", brief: "Argue for decomposability: a single opaque score invites gaming; four labeled sub-scores let the caller see WHY, and weight dimensions differently for their own risk appetite." },
      { heading: "Reading a Finding Code", brief: "Take 3-4 real finding codes (e.g. id.anonymous, cap.reachable, risk.no_tls) and explain exactly what triggers each and what severity means for downstream logic." },
      { heading: "Where the Score Can Be Wrong", brief: "Honest limitations: a probe timeout looks like unreachability even if the endpoint is fine on retry; a fresh legitimate agent scores low on reputation by construction. Say so plainly." },
    ],
  },
  {
    id: "evidiq-0g-tee-attestation",
    keyword: "0G TEE verifiable AI attestation",
    title: "Why EVIDIQ Anchors Every Trust Verdict on 0G with a TEE",
    angle:
      "Explain the verification chain end to end: hash, anchor, TEE analysis, signature — and argue for why each step is necessary, not decorative.",
    category: "0G Network",
    outline: [
      { heading: "What 'Verifiable' Has to Mean for a Machine", brief: "Featured-snippet: define 0G TEE verifiable AI attestation. Argue that a report a machine can't independently check is just an opinion with better formatting." },
      { heading: "Four Links in the Chain", brief: "Walk the exact chain in order: canonicalize -> keccak256 -> 0G Storage anchor -> EIP-191 signature. Name what breaks if any single link were skipped." },
      { heading: "What the TEE Actually Buys You", brief: "Explain concretely what a Trusted Execution Environment proves about the GLM-5.2 inference (the provider address + request id trace) versus a plain API call to a model you can't verify ran unmodified." },
      { heading: "How to Re-Verify a Report Yourself, Right Now", brief: "Literal steps: fetch the evidence from its 0G root hash, re-hash it, recover the signer from the EIP-191 signature. This should read like a mini how-to, not marketing." },
    ],
  },
  {
    id: "evidiq-okx-asp-a2mcp",
    keyword: "OKX.AI agent service provider",
    title: "EVIDIQ on OKX.AI: What an A2MCP Agent Service Provider Actually Does",
    angle:
      "Explain OKX.AI's ASP model and where EVIDIQ sits in it, for a reader who already has an OKX agent and wants to know what calling EVIDIQ buys them.",
    category: "OKX.AI",
    outline: [
      { heading: "What an A2MCP Agent Service Provider Is on OKX.AI", brief: "Featured-snippet definition, then contrast A2MCP against OKX's A2A (negotiated, escrowed) service model — two different shapes of agent commerce on the same marketplace." },
      { heading: "Where EVIDIQ Sits in an OKX Agent's Decision Loop", brief: "A concrete OKX agent workflow — receives a job offer from another OKX agent, calls EVIDIQ before accepting — placed at the exact decision point." },
      { heading: "Why Pay-Per-Call Instead of a Subscription Here", brief: "Argue the economic fit: an agent that verifies a counterparty once a week shouldn't pay the same as one that verifies a thousand times a day; x402 meters to actual use." },
      { heading: "Getting Listed Is Not the Same as Being Trusted", brief: "Be candid that marketplace listing and review status are OKX's own process, separate from what verify_agent evaluates about a THIRD agent — don't conflate the two." },
    ],
  },
  {
    id: "erc8004-identity-explained",
    keyword: "ERC-8004 agent identity",
    title: "ERC-8004 Agent Identity and Why EVIDIQ Checks For It",
    angle:
      "Written for developers who haven't heard of ERC-8004 yet — explain the standard first, EVIDIQ's use of it second.",
    category: "Standards",
    outline: [
      { heading: "ERC-8004 in Plain English", brief: "Featured-snippet: what ERC-8004 is and the problem it standardizes (an on-chain identity record for an agent, distinct from a bare wallet). No EVIDIQ mention yet — this section is the standard itself." },
      { heading: "A Wallet Address Is Not an Identity", brief: "Why an EOA alone conflates 'controls funds' with 'is a specific known agent' — anyone can generate a fresh address in a second; an ERC-8004 record can't be conjured the same way." },
      { heading: "How EVIDIQ Scores an ERC-8004 Anchor", brief: "The concrete scoring bump an erc8004Id gives the identity dimension, and why it's weighted higher than a bare address or an ENS name in the formula." },
      { heading: "Should You Register One for Your Own Agent?", brief: "Practical advice for a builder reading this: what registering buys them the next time THEIR agent is on the receiving end of someone else's verify_agent call." },
    ],
  },
  {
    id: "escrow-vs-proceed-recommendation",
    keyword: "AI agent escrow risk",
    title: "Proceed, Escrow, or Walk Away: How EVIDIQ Recommends a Verdict",
    angle:
      "Explain the four recommendation tiers with real thresholds, framed around the central design choice: EVIDIQ never holds funds.",
    category: "EVIDIQ",
    outline: [
      { heading: "Four Verdicts, Not a Yes/No", brief: "Featured-snippet: define the AI agent escrow risk angle — why a binary trust/no-trust answer fails the middle case. Name the four recommendations." },
      { heading: "The Thresholds, Exactly", brief: "State the real score/risk cutoffs that separate proceed from proceed_with_escrow from caution from do_not_proceed, pulled straight from the scoring logic." },
      { heading: "Why proceed_with_escrow Is the One Most Deals Land On", brief: "Argue that most real counterparties are neither obviously safe nor obviously fraudulent — this tier is the honest middle, and what pairing it with an actual escrow mechanism looks like." },
      { heading: "EVIDIQ Doesn't Hold the Money — Here's Why That's the Point", brief: "The custody boundary as a deliberate design choice, not a missing feature: evidence-and-recommendation vs. custody-and-authority are different trust models, and mixing them creates a bigger single point of failure." },
    ],
  },
  {
    id: "open-skill-vs-closed-plugin",
    keyword: "open agent skill MCP",
    title: "Why EVIDIQ Ships as an Open Skill, Not a Closed Plugin",
    angle:
      "Contrast a walled-garden plugin model with an open /skill.md + public MCP server + MIT-licensed mirror repos.",
    category: "EVIDIQ",
    outline: [
      { heading: "Open Agent Skill vs. Closed Plugin: the Actual Difference", brief: "Featured-snippet: define what makes a skill 'open' (readable spec, installable without a vendor SDK, source available) versus a closed plugin bound to one platform." },
      { heading: "What Vendor Lock-In Costs an Agent Builder", brief: "Concrete costs of a closed plugin model — can't audit what it does, can't self-host, can't fork it if the vendor pivots or shuts down." },
      { heading: "Three Places the Same Code Lives", brief: "Walk through evidiq.dev/skill.md, the public MCP server repo, and the skill spec repo — what's in each, and why keeping them separate but MIT-licensed matters." },
      { heading: "Installing It Into an Agent You Don't Control the Runtime Of", brief: "Practical one-liner installs into Claude Code / Cursor / a custom LangChain agent, and why an open skill can do this in a way a closed plugin structurally can't." },
    ],
  },
  {
    id: "endpoint-probe-explained",
    keyword: "verify AI agent endpoint reachability",
    title: "What EVIDIQ Actually Checks When It Probes an Agent's Endpoint",
    angle:
      "Precise, honest walkthrough of the live probe — what it proves and what it explicitly does not.",
    category: "EVIDIQ",
    outline: [
      { heading: "Six Seconds to Learn Something Real", brief: "Featured-snippet: define what an endpoint reachability probe checks. Frame the 6-second timeout budget as a deliberate constraint, not a limitation to apologize for." },
      { heading: "The Three Things One GET Request Reveals", brief: "TLS presence, HTTP status, and a body-content scan for skill/agent-card/MCP fingerprints — walk through each with what a pass and a fail look like." },
      { heading: "A Capability Claim Nobody Checked Is Just a Sentence", brief: "Why 'declares translation capability' means nothing on its own, and how the probe result changes the capability score depending on whether the endpoint backs the claim up." },
      { heading: "What This Probe Deliberately Does Not Do", brief: "Be explicit: it's not a penetration test, not a functional test of the declared capability, not a guarantee of uptime tomorrow. State the boundary so nobody over-relies on it." },
    ],
  },
  {
    id: "agent-economy-2026-problem",
    keyword: "agent to agent commerce 2026",
    title: "Agent-to-Agent Commerce in 2026: The Problem Nobody Solved Yet",
    angle:
      "Frame the broader shift and use verify_agent as the concrete example of what a solution looks like in practice — this is the widest-lens, most trend-forward piece.",
    category: "Agent Economy",
    outline: [
      { heading: "What Changed Between 2023 and Now", brief: "Featured-snippet: define agent-to-agent commerce in 2026. Contrast against 2023-era single-agent tool-calling — the qualitative shift is agents transacting with OTHER agents, not just tools." },
      { heading: "The Piece Everyone Built Except This One", brief: "Survey what's mature already — identity standards, payment rails like x402, compute and storage — and name the verification gap as the one piece still missing at scale." },
      { heading: "Machine Speed Breaks Human-Speed Trust Habits", brief: "The core argument: human trust-building (reviews, relationships, reputation over months) assumes time that agent-to-agent deals don't have — 800ms decisions need a different mechanism entirely." },
      { heading: "What a Working Answer Looks Like Today", brief: "Use verify_agent as one concrete, currently-shipping example of the shape a solution takes — not the only possible one, but a real one, grounded in specifics." },
    ],
  },
  {
    id: "evidiq-vs-manual-vetting",
    keyword: "vetting AI agents before payment",
    title: "Manual Vetting Doesn't Scale for AI Agents — Here's What Does",
    angle:
      "Direct comparison of human vetting process vs. machine-readable verification, honest about where EVIDIQ's reputation signal still falls short of a full history.",
    category: "Agent Economy",
    outline: [
      { heading: "How a Human Vets a New Vendor", brief: "Featured-snippet: define 'vetting AI agents before payment', then walk the familiar human process — reviews, references, a gut check — as the baseline being compared against." },
      { heading: "Every Step of That Process Assumes a Human Has Minutes", brief: "Go through the same steps and show where each one breaks down at agent speed: no time to read reviews, no LinkedIn for a bot, no gut to check." },
      { heading: "The Machine-Readable Equivalent", brief: "Show the JSON Trust Report next to the human checklist it replaces, mapping specific fields to the human step they stand in for." },
      { heading: "Where the Replacement Is Still Catching Up", brief: "Honest gap: today's reputation component is anchor-and-signal based, not a full transaction history the way a human reference call would be — say plainly what's still improving." },
    ],
  },
  {
    id: "evidiq-notary-receipts",
    keyword: "EVIDIQ Notary",
    title: "EVIDIQ Notary: Cryptographic Receipts for Every AI Output",
    angle:
      "Introduce EVIDIQ Notary as the receipt layer for AI inferences — what it proves (existence, integrity, provenance), how it works (EIP-191 sign + 0G Storage anchor + Merkle proof), and why agents need provable outputs.",
    category: "EVIDIQ Notary",
    outline: [
      { heading: "What Is an AI Output Receipt?", brief: "Featured-snippet definition: a cryptographic receipt proves a specific AI output (prompt + response + model) existed at a timestamp and was not altered. Name EVIDIQ Notary as the MCP server that issues them." },
      { heading: "Why AI Outputs Need Notarization", brief: "The problem: agents generate millions of outputs, almost none are provable. Did this model say this? When? Was it altered? A receipt answers all three." },
      { heading: "How EVIDIQ Notary Works End to End", brief: "Walk a single notarize_inference call: the MCP request, the x402 402 challenge, the EIP-191 signature, the 0G Storage upload, the returned receipt with storageRoot + storageTx. Use a concrete example." },
      { heading: "Verifying a Receipt Offline", brief: "Anyone can verify without the notary: recompute keccak256(prompt ‖ response), recover the EIP-191 signer, check the Merkle proof. No API key, no trust, no contact with the notary needed." },
    ],
  },
  {
    id: "evidiq-notary-0g-anchor",
    keyword: "AI output notarization",
    title: "How EVIDIQ Notary Anchors AI Inferences on 0G Storage",
    angle:
      "Deep-dive on the 0G Storage anchoring layer — ZgFile upload, turbo indexer, merkle root, on-chain tx — and why tamper-evident storage matters for AI audit trails.",
    category: "EVIDIQ Notary",
    outline: [
      { heading: "What 0G Storage Anchoring Means for AI Outputs", brief: "Featured-snippet: define 'AI output notarization' as anchoring a receipt on decentralized storage so it's tamper-evident and durable. Name 0G Storage Aristotle (chain 16661) as the layer EVIDIQ Notary uses." },
      { heading: "The Upload Flow: ZgFile to 0G Mainnet", brief: "Technical walk: receipt JSON → ZgFile.fromFilePath → indexer.upload via @0gfoundation/0g-ts-sdk → storageRoot + storageTx returned. Mention turbo indexer fallback and 30s timeout budget." },
      { heading: "Why Decentralized Storage Beats a Database for Audit Trails", brief: "A centralized log can be edited or deleted; a 0G Storage anchor is permanent and verifiable by anyone with the tx hash. Contrast against a traditional audit log." },
      { heading: "Six Tools, Four Free — the Notary MCP Surface", brief: "List the six tools (notarize_inference, notarize_batch, verify_attestation, get_receipt, notary_stats, notary_pubkey), note which are free, and explain how x402 gates only the two paid tools." },
    ],
  },
];

/** Internal links woven into every article. */
export const EVIDIQ_INTERNAL_LINKS = [
  { url: "https://evidiq.dev", anchor: "EVIDIQ" },
  { url: "https://evidiq.dev/docs", anchor: "EVIDIQ docs" },
  { url: "https://evidiq.dev/docs/notary", anchor: "EVIDIQ Notary docs" },
  { url: "https://evidiq.dev/skill.md", anchor: "the EVIDIQ skill" },
  { url: "https://evidiq.dev/playground", anchor: "try it in the EVIDIQ playground" },
];

export function pickInternalLinks(count = 3): typeof EVIDIQ_INTERNAL_LINKS {
  return EVIDIQ_INTERNAL_LINKS.slice(0, count);
}
