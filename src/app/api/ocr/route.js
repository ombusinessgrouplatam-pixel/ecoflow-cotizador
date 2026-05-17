import { generateText } from "ai";

export async function POST(req) {
  const { base64, mediaType } = await req.json();
  const isPDF = mediaType === "application/pdf";

  const fileContent = isPDF
    ? { type: "file", data: base64, mimeType: "application/pdf" }
    : { type: "image", image: `data:${mediaType};base64,${base64}` };

  try {
    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      messages: [
        {
          role: "user",
          content: [
            fileContent,
            {
              type: "text",
              text: "Analiza este recibo de energía eléctrica. Extrae la potencia demandada en watts (W) o kW. Si es kW multiplica por 1000. Responde SOLO con un número entero. Si no puedes determinarlo responde: 0",
            },
          ],
        },
      ],
      maxTokens: 256,
    });

    const watts = parseInt(text?.trim() || "0", 10) || 0;
    return Response.json({ watts });
  } catch (error) {
    console.error("OCR Error:", error);
    return Response.json({ watts: 0, error: error.message }, { status: 500 });
  }
}
