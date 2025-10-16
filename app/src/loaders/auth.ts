import { redirect, type ParsedLocation } from "@tanstack/react-router";
import { getSession } from "@/functions/auth";

export async function authenticate<T extends { location: ParsedLocation }>({
  location,
}: T) {
  const session = await getSession();
  if (!session || "error" in session) {
    console.warn("Invalid session:", session?.error);
    throw redirect({
      to: "/login",
      search: { callbackURL: location.pathname },
    });
  }

  return session;
}
