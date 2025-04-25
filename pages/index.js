// pages/index.js

export async function getServerSideProps() {
  const sheetJsonUrl =
    "https://docs.google.com/spreadsheets/d/1hMzZXcw6eF2erhiLVOi6ZCSkwYQFFOhoGywPnRZI_cA/gviz/tq?tqx=out:json";

  try {
    const res = await fetch(sheetJsonUrl);
    const text = await res.text();
    const json = JSON.parse(text.replace(/^.*?\(|\);?$/g, ""));
    const rows = json.table.rows;
    const latestRow = rows[rows.length - 1];
    const latestUrl = latestRow?.c?.[1]?.v;

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
    console.error("Redirection failed", error);
    return {
      props: {},
    };
  }
}

export default function Home() {
  return <div>리디렉션 중입니다...</div>;
}
