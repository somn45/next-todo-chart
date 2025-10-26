import { ObjectId } from "mongodb";
import EditForm from "./EditForm";

interface TodoComponentProps {
  _id: ObjectId;
  textField: string;
}

export default function TodoPage({ _id, textField }: TodoComponentProps) {
  return (
    <li>
      <span>{textField}</span>
      <EditForm />
      <button>삭제</button>
    </li>
  );
}
