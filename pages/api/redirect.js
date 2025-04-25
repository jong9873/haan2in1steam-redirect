// 파일 경로: your-project/pages/api/redirect.js

export default async function handler(req, res) {
  // 1) Google Sheets JSONP URL
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    // 2) 원본 텍스트 응답
    const response = await fetch(sheetJsonUrl);
    const text = await response.text();

    // 3) JSONP 래퍼 및 주석 제거
    const cleanText = text
      .replace(/^\s*\/\*.*?\*\/\s*/, "") // /*O_o*/ 제거
      .replace(/^.*?\(/, "")             // 함수 호출 앞부분 제거
      .replace(/\);?$/, "");             // 끝 괄호 제거

    // 4) 순수 JSON 파싱
    const data = JSON.parse(cleanText);

    // 5) rows 배열 가져오기
    const rows = data.table?.rows;
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("rows 비어 있음");
    }

    // 6) 마지막 행에서 두 번째 셀 가져오기
    const latestRow = rows[rows.length - 1];
    const columns = latestRow.c;
    if (!Array.isArray(columns) || columns.length < 2) {
      throw new Error("c[1] 없음");
    }

    // 7) v 또는 f 필드에서 URL 추출
    const cell = columns[1];
    const latestUrl = String(cell.v || cell.f || "").trim();

    // 8) 유효성 검사
    if (!latestUrl.startsWith("http")) {
      throw new Error("유효하지 않은 URL: " + latestUrl);
    }

    // 9) 302 리디렉션
    res.writeHead(302, { Location: latestUrl });
    res.end();

  } catch (e) {
    // 에러 발생 시 정확한 사유를 브라우저에 출력
    console.error("❌ 리디렉션 실패:", e.message);
    res.status(500).send("리디렉션 실패: " + e.message);
  }
}
