interface ButtonProps {
  type: "button" | "submit";
  value: string | React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "searchBar" | "submit";
}

export default function Button({
  type,
  value,
  onClick,
  variant = "default",
}: ButtonProps) {
  const variants: { [key: string]: string } = {
    default: "",
    searchBar: "submit-default size-12 absolute top-2 right-0",

    submit: "submit-default",
  };
  if (type === "button")
    return (
      <button type="button" onClick={onClick} className="cursor-pointer">
        {value}
      </button>
    );
  return (
    <button type={type} className={variants[variant]}>
      {value}
    </button>
  );
}
