import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading Login...</div>}>
      <LoginClient />
    </Suspense>
  );
}
