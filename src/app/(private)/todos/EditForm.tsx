"use client";

import { useState } from "react";

export default function EditForm() {
  const [isEditMode, setIsEditMode] = useState(false);
  if (!isEditMode)
    return <button onClick={() => setIsEditMode(true)}>수정</button>;
  return (
    <form>
      <input
        type="text"
        placeholder="투두리스트 작성"
        name="todo"
        aria-label="수정된 투두리스트"
      />
      <button onClick={() => setIsEditMode(false)}>수정 완료</button>
    </form>
  );
}
