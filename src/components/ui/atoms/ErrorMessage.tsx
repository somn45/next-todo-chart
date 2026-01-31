interface ErrorMessageProps {
  message: string;
  dataTestId?: string;
}

export default function ErrorMessage({
  message,
  dataTestId,
}: ErrorMessageProps) {
  return <p data-testid={dataTestId}>{message}</p>;
}
