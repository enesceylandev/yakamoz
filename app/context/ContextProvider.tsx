import { RoomProvider } from "./roomContext";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return <RoomProvider>{children}</RoomProvider>;
}
