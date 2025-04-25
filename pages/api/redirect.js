export default async function handler(req, res) {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const response = await fetch(sheetJsonUrl);
    const text = await response.text();
    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, ""));

    const rows = json?.table?.rows;
    const latestRow = rows?.[rows.length - 1];
    const cell = latestRow?.c?.[1];

    // ✅ 핵심: f 또는 v 중 존재하는 값을 사용
    const latestUrl = cell?.v || cell?.f;

    if (!latestUrl || !latestUrl.startsWith("http")) {
      throw new Error("유효하지 않은 URL");
    }

    res.writeHead(302, { Location: latestUrl });
    res.end();
  } catch (e) {
    console.error("❌ 리디렉션 실패:", e);
    res.status(500).send("리디렉션 실패");
  }
}
