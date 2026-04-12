interface TextProps {
  content: string;
  dataTestId?: string;
}

export default function Text({ content, dataTestId }: TextProps) {
  return (
    <span
      data-testid={dataTestId}
      className="text-text-light text-base font-semibold"
    >
      {content}
    </span>
  );
}
