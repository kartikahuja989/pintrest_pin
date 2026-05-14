"use client";
import { useState } from "react";
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  return { message, toast: setMessage, clear: () => setMessage(null) };
}
