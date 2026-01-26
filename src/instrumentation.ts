import schedule from "node-schedule";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { setTodoStats } = await import("@/apis/setTodoStats");
    await setTodoStats();
    schedule.scheduleJob(
      { hour: 0, minute: 0, tz: "Asia/Seoul" },
      async function () {
        try {
          await setTodoStats();
        } catch (error) {
          console.error(error);
        }
      },
    );
  }
}
