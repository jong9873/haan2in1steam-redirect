import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    async function fetchRedirect() {
      try {
        const res = await fetch('/api/redirect');
        const data = await res.json();
        if (data && data.url) {
          window.location.href = data.url;
        } else {
          console.error('❌ 리디렉션 URL을 받아오지 못했습니다.');
        }
      } catch (err) {
        console.error('❌ 리디렉션 실패:', err);
      }
    }

    fetchRedirect();
  }, []);

  return null; // 🔥 아무것도 렌더링 안함
}
