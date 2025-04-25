export default async function handler(req, res) {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const response = await fetch(sheetJsonUrl);
    const text = await response.text();

    console.log("✅ Raw text preview:", text.slice(0, 300));

    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, ""));
    const rows = json?.table?.rows;
    console.log("✅ rows =", rows);

    const latestRow = rows?.[rows.length - 1];
    console.log("✅ latestRow =", latestRow);

    // ✅ null-safe URL 추출 로직
    const urlCandidate = latestRow?.c?.[1];

    let latestUrl = null;
    if (urlCandidate) {
      latestUrl = urlCandidate.v || urlCandidate.f || null;
    }

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
