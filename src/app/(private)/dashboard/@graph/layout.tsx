import { Suspense } from "react";
import Navigation from "./Navigation";

export default function DashboardGraphLayout({
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
