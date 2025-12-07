import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
