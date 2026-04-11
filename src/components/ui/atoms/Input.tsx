import { InputProps } from "@/types/ui";

export default function Input({
  type,
  name,
  ariaLabel,
  defaultValue,
  placeholder,
  dataTestId,
  isReadOnly = false,
  isHidden = false,
  variant = "default",
}: InputProps) {
  const variants: { [key: string]: string } = {
    default: "input-default",
    searchBar: "input-default w-full max-w-lg",
  };
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      readOnly={isReadOnly}
      hidden={isHidden}
      className={variants[variant]}
    />
  );
}
