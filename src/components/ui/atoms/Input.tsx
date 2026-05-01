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
    edit: "py-1 pl-2 text-sm outline-0 bg-surface-light text-text-light placeholder:text-text-disabled w-calc[100%-136px] h-full",
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
