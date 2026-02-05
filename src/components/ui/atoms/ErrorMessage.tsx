interface ErrorMessageProps {
  message: string;
  dataTestId?: string;
  successSignal?: string;
}

export default function ErrorMessage({
  message,
  dataTestId,
  successSignal,
}: ErrorMessageProps) {
  const isShowErrorMessage = message !== successSignal ? true : false;

  if (successSignal)
    return <p data-testid={dataTestId}>{isShowErrorMessage ? message : ""}</p>;
  return <p data-testid={dataTestId}>{message}</p>;
}
