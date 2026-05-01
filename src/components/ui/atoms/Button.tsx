interface ButtonProps {
  type: "button" | "submit";
  value: string | React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "button" | "searchBar" | "submit";
}

export default function Button({
  type,
  value,
  onClick,
  variant = "default",
}: ButtonProps) {
  const variants: { [key: string]: string } = {
    default:
      "rounded-md px-2 py-1 flex justify-center items-center hover:underline h-8 text-sm font-semibold",
    button:
      "rounded-md px-2 py-1 flex justify-center items-center bg-1st-light h-8 text-sm font-semibold",
    searchBar: "submit-default size-12 absolute top-2 right-0",
    submit: "submit-default",
  };
  if (type === "button")
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${variants[variant]} cursor-pointer`}
      >
        {value}
      </button>
    );
  return (
    <button type={type} className={variants[variant]}>
      {value}
    </button>
  );
}
