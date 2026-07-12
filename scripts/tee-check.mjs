const KEY = "sk-7e549737-04f5-4e45-a3a7-d7c9381e15c0";
const URL = "https://router-api.0g.ai/v1/chat/completions";

for (const m of ["glm-5.2", "qwen3.7-plus"]) {
  try {
    const r = await fetch(URL, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + KEY },
      body: JSON.stringify({
        model: m,
        messages: [{ role: "user", content: "Reply with just: OK" }],
        max_tokens: 40,
        reasoning_effort: "none",
      }),
    });
    const j = await r.json();
    const tr = j.x_0g_trace || {};
    console.log(
      m.padEnd(15),
      "status=" + r.status,
      "TEE_provider=" + (tr.provider || "NONE"),
      "req=" + (tr.request_id || "none").slice(0, 14),
      "verified=" + Boolean(tr.provider)
    );
    if (!tr.provider) console.log("   top-level keys:", Object.keys(j).join(", "));
  } catch (e) {
    console.log(m, "ERROR:", e.message);
  }
}
