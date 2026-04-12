import { InputProps } from "@/types/ui";
import Input from "../atoms/Input";
import StateOption from "../atoms/StateOption";
import { StateType } from "@/types/todos/schema";

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
  state: StateType;
}

export default function SelectField({
  formAttr,
  inputAttr,
  buttonAttr,
  state,
}: SelectFieldProps) {
  console.log(formAttr.isHidden);
  return (
    <form action={formAttr.action} role="form" aria-label={formAttr.ariaLabel}>
      <Input
        type={inputAttr.type}
        name={inputAttr.name}
        defaultValue={inputAttr.defaultValue}
        ariaLabel={inputAttr.ariaLabel}
        isReadOnly={true}
        isHidden={true}
      />
      <StateOption stateType={state} isActive={formAttr.isHidden} />
    </form>
  );
}
