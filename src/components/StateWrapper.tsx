"use client";

import { EventProvider } from "@/context/EventContext";

export default function StateWrapper({ children }: { children: React.ReactNode }) {
  return <EventProvider>{children}</EventProvider>;
}
