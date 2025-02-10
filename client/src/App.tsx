'use client';

import { Toaster } from "@/components/ui/toaster";

function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

export default App;