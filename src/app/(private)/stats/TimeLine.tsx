import { LookupedTodo, WithStringifyId } from "@/types/schema";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
}

export default function TimeLine({ todos }: TimeLineProps) {
  return <div></div>;
}
