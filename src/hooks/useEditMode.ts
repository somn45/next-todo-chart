import { useEffect, useState } from "react";

type useEditModeType = (
  errorMessage: string,
) => [boolean, () => void, () => void];

const useEditMode: useEditModeType = errorMessage => {
  const [isEditMode, setIsEditMode] = useState(false);
  const setEditMode = () => setIsEditMode(true);
  const setReadMode = () => setIsEditMode(false);

  useEffect(() => {
    if (errorMessage === "투두 수정 성공") setIsEditMode(false);
  }, [errorMessage]);

  return [isEditMode, setEditMode, setReadMode];
};

export default useEditMode;
