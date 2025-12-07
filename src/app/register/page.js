import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <RegisterClient />
    </Suspense>
  );
}
