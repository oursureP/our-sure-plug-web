import { Suspense } from "react";
import { InvoiceForm } from "@/app/components/invoices/invoice-form";

export default function NewInvoicePage() {
  return (
    <Suspense fallback={null}>
      <InvoiceForm />
    </Suspense>
  );
}
