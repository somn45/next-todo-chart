"use client";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorBoundary({
  error,
  reset,
}: ErrorBoundaryProps) {
  return (
    <html>
      <body>
        <h2>{error.message}</h2>
        <span>문제가 발생하여 웹 애플리케이션의 동작이 중지되었습니다.</span>
        <button onClick={() => reset()}>다시 시도하기</button>
      </body>
    </html>
  );
}
