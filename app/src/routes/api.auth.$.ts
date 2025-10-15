import { auth } from "$/auth.server";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});
