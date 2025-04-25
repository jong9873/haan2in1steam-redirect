export default async function handler(req, res) {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const response = await fetch(sheetJsonUrl);
    const text = await response.text();

    // ✅ 원본 응답 일부 출력
    console.log("✅ Raw text preview:", text.slice(0, 300));

    // ✅ JSON 변환
    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, ""));

    // ✅ 구조 확인
    const rows = json?.table?.rows;
    console.log("✅ rows =", rows);

    const latestRow = rows?.[rows.length - 1];
    console.log("✅ latestRow =", latestRow);

    // ✅ URL 추출 로직 개선 (v 또는 f 사용)
    const urlCandidate = latestRow?.c?.[1];
    const latestUrl = urlCandidate?.v ?? urlCandidate?.f ?? null;
    console.log("✅ latestUrl =", latestUrl);

    if (!latestUrl || !latestUrl.startsWith("http")) {
      throw new Error("유효하지 않은 URL");
    }

    // ✅ 리디렉션
    res.writeHead(302, { Location: latestUrl });
    res.end();
  } catch (e) {
    console.error("❌ 리디렉션 실패:", e);
    res.status(500).send("리디렉션 실패");
  }
}
