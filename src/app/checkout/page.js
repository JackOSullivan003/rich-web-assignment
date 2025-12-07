import { Suspense } from "react";
import CheckoutPageClient from "./CheckoutClient";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
