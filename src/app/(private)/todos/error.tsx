"use client";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorBoundaryProps) {
  return (
    <div>
      <span>{error.message}</span>
      <span>현재 투두리스트 항목을 불러올 수 없습니다.</span>
      <button onClick={() => reset()}>다시 시도하기</button>
    </div>
  );
}
