import { createFileRoute } from "@tanstack/react-router";
import * as lu from "lucide-react";
import { css } from "$/panda.gen/css";
import { center } from "$/panda.gen/patterns";
import { Alert } from "$/park-ui/components";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <article className={center({ w: "screen", h: "screen" })}>
      <Alert.Root className={css({ maxW: "sm" })} variant="outline">
        <lu.CheckCircle />
        <Alert.Content>
          <Alert.Title className={css({ fontSize: "md" })}>
            Ready to Go!
          </Alert.Title>
        </Alert.Content>
      </Alert.Root>
    </article>
  );
}
