import { InputProps } from "@/types/ui";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

interface SelectFieldProps {
  formAttr: {
    action: (payload: FormData) => void;
    ariaLabel: string;
    isHidden: boolean;
  };
  inputAttr: InputProps;
  buttonAttr: {
    value: string;
  };
}

export default function SelectField({
  formAttr,
  inputAttr,
  buttonAttr,
}: SelectFieldProps) {
  return (
    <form
      action={formAttr.action}
      role="form"
      aria-label={formAttr.ariaLabel}
      hidden={formAttr.isHidden}
    >
      <Input
        type={inputAttr.type}
        name={inputAttr.name}
        defaultValue={inputAttr.defaultValue}
        ariaLabel={inputAttr.ariaLabel}
        isReadOnly={true}
        isHidden={true}
      />
      <Button type="submit" value={buttonAttr.value} />
    </form>
  );
}
