export async function POST(req) {
  const { base64, mediaType } = await req.json();
  const isPDF = mediaType === "application/pdf";

  const block = isPDF
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
    : { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      messages: [{
        role: "user",
        content: [
          block,
          { type: "text", text: "Analiza este recibo de energía eléctrica. Extrae la potencia demandada en watts (W) o kW. Si es kW multiplica por 1000. Responde SOLO con un número entero. Si no puedes determinarlo responde: 0" }
        ]
      }]
    })
  });

  const data = await res.json();
  const watts = parseInt(data.content?.[0]?.text?.trim() || "0", 10) || 0;
  return Response.json({ watts });
}
