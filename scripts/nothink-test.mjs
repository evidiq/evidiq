const KEY = "sk-7e549737-04f5-4e45-a3a7-d7c9381e15c0";
const URL = "https://router-api.0g.ai/v1/chat/completions";
const prompt =
  "Explain in about 120 words why autonomous AI agents need an on-chain trust and reputation layer before transacting.";

const tests = [
  { name: "qwen3.7-plus  DEFAULT", model: "qwen3.7-plus", extra: {} },
  { name: "qwen3.7-plus  enable_thinking:false", model: "qwen3.7-plus", extra: { chat_template_kwargs: { enable_thinking: false } } },
  { name: "qwen3.7-plus  reasoning_effort:none", model: "qwen3.7-plus", extra: { reasoning_effort: "none" } },
  { name: "qwen3.7-plus  reasoning_effort:low", model: "qwen3.7-plus", extra: { reasoning_effort: "low" } },
  { name: "glm-5.2  DEFAULT", model: "glm-5.2", extra: {} },
  { name: "glm-5.2  enable_thinking:false", model: "glm-5.2", extra: { chat_template_kwargs: { enable_thinking: false } } },
  { name: "glm-5.2  reasoning_effort:none", model: "glm-5.2", extra: { reasoning_effort: "none" } },
];

for (const t of tests) {
  const t0 = Date.now();
  let j;
  try {
    const r = await fetch(URL, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + KEY },
      body: JSON.stringify({
        model: t.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.3,
        ...t.extra,
      }),
    });
    j = await r.json();
  } catch (e) {
    console.log(t.name.padEnd(38), "FETCH ERR", e.message);
    continue;
  }
  if (j.error) {
    console.log(t.name.padEnd(38), "API ERR:", JSON.stringify(j.error).slice(0, 90));
    continue;
  }
  const dt = (Date.now() - t0) / 1000;
  const ct = j.usage?.completion_tokens || 0;
  const msg = j.choices?.[0]?.message || {};
  const reasoningLen = (msg.reasoning_content || "").length;
  console.log(
    t.name.padEnd(38),
    dt.toFixed(1) + "s",
    "out=" + ct,
    (ct / dt).toFixed(0) + " tok/s",
    reasoningLen > 0 ? "reasoning=" + reasoningLen + "ch" : "no-reasoning"
  );
}
