import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/redirect");
  }, []);

  return <div>리디렉션 중입니다...</div>;
}
