interface TextProps {
  content: string;
  dataTestId?: string;
}

export default function Text({ content, dataTestId }: TextProps) {
  return <span data-testid={dataTestId}>{content}</span>;
}
