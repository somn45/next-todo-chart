import { RefObject, useEffect, useState } from "react";

type useGraceTimeAlertMessageType = (
  state: "할 일" | "진행 중" | "완료",
  deleteCompletedTodoTimerId: RefObject<NodeJS.Timeout | null>,
  todoCompletedAt: string | null,
) => { hasGracePeriod: boolean; alertMessage: string };

const useGraceTimeAlertMessage: useGraceTimeAlertMessageType = (
  state,
  deleteCompletedTodoTimerId,
  todoCompletedAt,
) => {
  const [hasGracePeriod, setHasGracePeriod] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");

  const hideGraceTimeMessage = () => {
    setHasGracePeriod(false);
    setAlertMessage("");
  };

  const showGraceTimeMessage = () => {
    setAlertMessage(
      `이 할 일은 완료 상태입니다. ${todoCompletedAt} 까지 완료 상태 지속 시 영구히 완료 상태가 됩니다.`,
    );
    setHasGracePeriod(true);
  };

  /**
   * 투두의 상태가 완료가 될 시 유예 시간을 계산해
   * 해당 시간 뒤에 해당 투두가 소멸되는 작업 스케줄링 추가
   * 및 사용자에게 투두 유예 시간을 알리는 메세지를 출력하는 과정
   */
  useEffect(() => {
    if (!todoCompletedAt) {
      clearTimeout(deleteCompletedTodoTimerId.current ?? "");
      hideGraceTimeMessage();
      return;
    }
    const todoCompletedDate = new Date(todoCompletedAt);
    const gracePeriod = todoCompletedDate.getTime() - Date.now();

    // 유예 시간이 남아있을 떼
    if (gracePeriod > 0) {
      showGraceTimeMessage();
      deleteCompletedTodoTimerId.current = setTimeout(
        () => hideGraceTimeMessage(),
        gracePeriod,
      );
    }
  }, [todoCompletedAt, state]);

  return { hasGracePeriod, alertMessage };
};

export default useGraceTimeAlertMessage;
