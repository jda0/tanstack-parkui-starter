import { createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import * as lu from "lucide-react";
import { AbsoluteCenter, Alert, Text } from "$/park-ui/components";
import { Link } from "$/park-ui/tanstack";
import { auth } from "$/auth.server";
import { authClient } from "$/auth.client";

const getSession = createIsomorphicFn()
  .server(function () {
    const { headers } = getRequest();
    return auth.api.getSession({ headers });
  })
  .client(function () {
    return authClient.getSession();
  });

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async function ({}) {
    const session = await getSession();
    if (!session || "error" in session) {
      console.warn("Invalid session:", session?.error);
      throw redirect({
        to: "/login",
        search: { callbackURL: location.pathname },
      });
    }

    return session;
  },
});

function App() {
  const { user } = Route.useRouteContext();

  return (
    <AbsoluteCenter css={{ gap: 3, flexDirection: "column" }}>
      <Alert.Root css={{ width: "xs" }} variant="outline">
        <lu.CheckCircle />
        <Alert.Content>
          <Alert.Title css={{ fontSize: "md" }}>Ready to Go!</Alert.Title>
        </Alert.Content>
      </Alert.Root>
      <Text css={{ fontSize: "sm" }}>
        Signed in as {user.name}.{" "}
        <Link to="/logout" variant="plain">
          Sign out
        </Link>
      </Text>
    </AbsoluteCenter>
  );
}
