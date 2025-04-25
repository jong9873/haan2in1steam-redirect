// pages/index.js

export async function getServerSideProps() {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const res = await fetch(sheetJsonUrl);
    const text = await res.text();
    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, "")); // JSON 파싱

    const rows = json.table.rows;
    const latestRow = rows[rows.length - 1];
    const latestUrl = latestRow?.c?.[1]?.v;

    console.log("🔗 Redirecting to:", latestUrl); // 로그 확인용

    if (!latestUrl || !latestUrl.startsWith("http")) {
      throw new Error("Invalid or missing redirect URL");
    }

    return {
      redirect: {
        destination: latestUrl,
        permanent: false,
      },
    };
  } catch (error) {
    console.error("❌ Redirection failed:", error);
    return { notFound: true };
  }
}

export default function Home() {
  return null;
}
