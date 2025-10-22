interface FormState {
  newTodo: string;
}

interface FormProps {
  serverAction: (payload: FormData) => void;
  initialState: FormState;
}

export default function TodosForm({ serverAction }: FormProps) {
  return (
    <form action={serverAction}>
      <input
        type="text"
        placeholder="새 투두리스트 추가"
        name="newTodo"
        aria-label="새 투두리스트"
      />
      <button type="submit">새 투두리스트 추가</button>
    </form>
  );
}
