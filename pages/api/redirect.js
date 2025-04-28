// /pages/api/redirect.js

let cachedUrl = null;
let cacheTime = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5분

export default async function handler(req, res) {
  try {
    const now = Date.now();

    // 캐시가 있고, 5분 안 지났으면 캐시된 URL 사용
    if (cachedUrl && (now - cacheTime) < CACHE_DURATION_MS) {
      return res.status(200).json({ url: cachedUrl });
    }

    // 구글시트 데이터 가져오기
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json';
    const response = await fetch(sheetUrl);
    const text = await response.text();

    // JSONP 포맷 정리
    const jsonText = text
      .replace(/^[^\(]*\(/, '')
      .replace(/\);?$/, '');
    const data = JSON.parse(jsonText);

    // B열 마지막 URL 가져오기
    const rows = data.table.rows;
    const latestRow = rows[rows.length - 1];
    const latestUrl = latestRow?.c?.[1]?.v || latestRow?.c?.[1]?.f;

    if (!latestUrl) {
      return res.status(500).json({ error: '❌ 구글시트에서 URL을 찾지 못했습니다.' });
    }

    // 캐시 저장
    cachedUrl = latestUrl;
    cacheTime = now;

    // 결과 반환
    return res.status(200).json({ url: latestUrl });

  } catch (err) {
    console.error('❌ 에러 발생:', err);
    return res.status(500).json({ error: '❌ 서버 오류' });
  }
}
