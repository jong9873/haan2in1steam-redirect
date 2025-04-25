export default async function handler(req, res) {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const response = await fetch(sheetJsonUrl);
    const text = await response.text();

    // ✅ 응답 전체 찍기
    console.log("✅ Raw text preview:", text.slice(0, 500));

    // ✅ JSON 파싱
    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, ""));

    // ✅ 전체 구조 확인
    console.log("✅ Parsed JSON:", JSON.stringify(json, null, 2));

    const rows = json?.table?.rows;
    console.log("✅ rows =", rows);

    const latestRow = rows?.[rows.length - 1];
    console.log("✅ latestRow =", latestRow);

    const latestUrl = latestRow?.c?.[1]?.v;
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
