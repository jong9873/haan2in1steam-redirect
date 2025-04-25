import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/api/redirect"; // 서버 API 라우트 호출 → 302 리디렉션
  }, []);

  return <div>리디렉션 중입니다...</div>;
}
