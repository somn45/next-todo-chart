import { Suspense } from "react";
import Navigation from "./Navigation";

export default function DailyActiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={<p>...Loading</p>}>
        <Navigation />
      </Suspense>
      {children}
    </div>
  );
}
