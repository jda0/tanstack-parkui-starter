import { authClient } from "$/auth.client";
import { auth } from "$/auth.server";
import { AbsoluteCenter, Spinner } from "$/park-ui/components";
import * as lu from "lucide-react";
import { Alert } from "$/park-ui/components";
import { Link } from "$/park-ui/tanstack";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

const signOut = createIsomorphicFn()
  .server(function () {
    const { headers } = getRequest();
    return auth.api.signOut({ headers });
  })
  .client(function () {
    return authClient.signOut();
  });

export const Route = createFileRoute("/logout")({
  beforeLoad: signOut,
  component: Logout,
  pendingComponent: LogoutPending,
});

function LogoutPending() {
  return (
    <AbsoluteCenter>
      <Spinner />
    </AbsoluteCenter>
  );
}

function Logout() {
  return (
    <AbsoluteCenter css={{ gap: 3, flexDirection: "column" }}>
      <Alert.Root css={{ width: "xs" }} variant="outline">
        <lu.CheckCircle />
        <Alert.Content>
          <Alert.Title css={{ fontSize: "md" }}>Signed out</Alert.Title>
        </Alert.Content>
      </Alert.Root>
      <Link css={{ fontSize: "sm" }} to="/" variant="plain">
        Go back
      </Link>
    </AbsoluteCenter>
  );
}
