import { createFileRoute } from "@tanstack/react-router";
import * as lu from "lucide-react";
import { Center } from "$/panda.gen/jsx";
import { Alert } from "$/park-ui/components";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <Center css={{ w: "screen", h: "screen" }}>
      <Alert.Root css={{ maxW: "sm" }} variant="outline">
        <lu.CheckCircle />
        <Alert.Content>
          <Alert.Title css={{ fontSize: "md" }}>Ready to Go!</Alert.Title>
        </Alert.Content>
      </Alert.Root>
    </Center>
  );
}
