import { useErrorBoundary } from "react-error-boundary";

export default function TodoFallback({ error }: { error: Error }) {
  const { resetBoundary } = useErrorBoundary();
  return (
    <div>
      <h2>{error.message}</h2>
      <span>할 일 양식을 불러오던 도중 에러가 발생했습니다.</span>
      <button onClick={() => resetBoundary()}>다시 시도하기</button>
    </div>
  );
}
