import schedule from "node-schedule";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    schedule.scheduleJob(
      { hour: 0, minute: 0, tz: "Asia/Seoul" },
      async function () {
        try {
          const { setTodoStats } = await import("@/apis/setTodoStats");
          await setTodoStats();
        } catch (error) {
          console.error(error);
        }
      },
    );
  }
}
