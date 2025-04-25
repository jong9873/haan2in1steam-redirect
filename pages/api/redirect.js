export default async function handler(req, res) {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const response = await fetch(sheetJsonUrl);
    const text = await response.text();

    // JSONP → JSON 파싱
    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, ""));

    // rows 존재 여부 확인
    const rows = json?.table?.rows;
    if (!rows || rows.length === 0) throw new Error("rows 비어 있음");

    const latestRow = rows[rows.length - 1];
    const columns = latestRow?.c;

    if (!Array.isArray(columns) || columns.length < 2) {
      throw new Error("열 정보가 부족함 (c[1] 없음)");
    }

    const cell = columns[1];
    const latestUrl = cell?.v || cell?.f || null;

    if (!latestUrl || typeof latestUrl !== "string" || !latestUrl.startsWith("http")) {
      throw new Error("유효하지 않은 URL 구조");
    }

    // 최종 리디렉션
    res.writeHead(302, { Location: latestUrl });
    res.end();
  } catch (e) {
    console.error("❌ 리디렉션 실패:", e.message);
    res.status(500).send("리디렉션 실패: " + e.message);
  }
}
