import { createFileRoute } from "@tanstack/react-router";
import * as lu from "lucide-react";
import { AbsoluteCenter, Alert, Text } from "$/park-ui/components";
import { Link } from "$/park-ui/tanstack";
import { authenticate } from "@/loaders/auth";

export const Route = createFileRoute("/")({
  beforeLoad: authenticate,
  component: App,
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
