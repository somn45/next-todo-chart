"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function InterceptedLoginModal() {
  const router = useRouter();
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 100,
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (
          modalContentRef.current &&
          !modalContentRef.current.contains(e.currentTarget)
        ) {
          router.back();
        }
      }}
    >
      <div
        style={{
          width: "400px",
          height: "300px",
          paddingTop: "30px",
          backgroundColor: "white",
          borderRadius: "12px",
          fontSize: "20px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          zIndex: 200,
        }}
        ref={modalContentRef}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        가로챈 로그인 모달
      </div>
    </div>
  );
}
