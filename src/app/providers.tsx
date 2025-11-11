"use client";

import { CartProvider } from "@/lib/cart-context";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <CartProvider>{children}</CartProvider>
    </FirebaseClientProvider>
  );
}
