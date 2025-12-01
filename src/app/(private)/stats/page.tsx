import { cookies } from "next/headers";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import LineGraphWrapper from "./LineGraphWrapper";
import FakeLineGraphWrapper from "./FakeLineGraphWrapper";
import { Suspense } from "react";
import LoadingFallback from "./Fallback";

interface AccessTokenPayload {
  sub: string;
}

export default async function Stats() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  return (
    <section style={{ width: "1200px", display: "flex", gap: "20px" }}>
      <Suspense fallback={<LoadingFallback />}>
        <LineGraphWrapper userid={userid} />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <FakeLineGraphWrapper />
      </Suspense>
    </section>
  );
}
