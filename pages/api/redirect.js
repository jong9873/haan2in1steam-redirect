export default async function handler(req, res) {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const response = await fetch(sheetJsonUrl);
    const text = await response.text();
    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, ""));
    const rows = json.table.rows;
    const latestRow = rows[rows.length - 1];
    const latestUrl = latestRow?.c?.[1]?.v;

    console.log("🟢 리디렉션 대상 URL:", latestUrl);

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
