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

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>
      <h1>리디렉션 중입니다...</h1>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}
