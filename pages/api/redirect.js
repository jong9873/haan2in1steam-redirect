export default async function handler(req, res) {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const response = await fetch(sheetJsonUrl);
    const text = await response.text();

    // ✅ 응답 본문 일부 로그로 출력
    console.log("✅ 응답 body 일부:", text.slice(0, 300));

    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, ""));
    const rows = json.table.rows;

    // ✅ rows 내용 로그
    console.log("✅ rows =", rows);

    const latestRow = rows[rows.length - 1];
    const latestUrl = latestRow?.c?.[1]?.v;

    // ✅ 최종 URL 로그
    console.log("✅ latestUrl =", latestUrl);

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
