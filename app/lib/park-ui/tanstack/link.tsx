import * as ui from "$/park-ui/components/link";
import {
  Link as TanstackLink,
  type LinkProps as TanstackLinkProps,
} from "@tanstack/react-router";

export function Link(
  props: Pick<ui.LinkProps, "css" | "variant"> & TanstackLinkProps
) {
  const { css, variant, ...rest } = props;

  return (
    <ui.Link asChild css={css} variant={variant}>
      <TanstackLink {...rest} />
    </ui.Link>
  );
}
