import { Suspense } from "react";
import Navigation from "./Navigation";

export default function DailyActiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<p>...Loading</p>}>
        <Navigation />
      </Suspense>
      {children}
    </div>
  );
}
