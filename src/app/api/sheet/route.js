export async function GET() {
  const sheetId = process.env.NEXT_PUBLIC_SHEET_ID;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Sheet error");
    const text = await res.text();
    return Response.json({ csv: text });
  } catch {
    return Response.json({ csv: null }, { status: 500 });
  }
}
