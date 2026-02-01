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
}: InputProps) {
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
    />
  );
}
