import { Suspense } from "react";
import ManagerClient from "./ManagerClient";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <ManagerClient />
    </Suspense>
  );
}
