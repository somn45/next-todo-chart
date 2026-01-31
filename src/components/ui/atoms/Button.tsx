interface ButtonProps {
  type: "button" | "submit";
  value: string;
  onClick?: () => void;
}

export default function Button({ type, value, onClick }: ButtonProps) {
  if (type === "button")
    return (
      <button type="button" onClick={onClick} style={{ maxWidth: "80px" }}>
        {value}
      </button>
    );
  return <button type={type}>{value}</button>;
}
