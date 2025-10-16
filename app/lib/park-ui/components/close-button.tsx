import { XIcon } from "lucide-react";
import { forwardRef } from "react";
import { IconButton, type IconButtonProps } from "./icon-button";

import { css, cx } from "styled-system/css";

export type CloseButtonProps = IconButtonProps;

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(props, ref) {
    const { children, className, ...rest } = props;
    const klassName = cx(css({ colorPalette: "gray" }), className);

    return (
      <IconButton
        variant="plain"
        className={klassName}
        aria-label="Close"
        ref={ref}
        {...rest}
      >
        {children ?? <XIcon />}
      </IconButton>
    );
  }
);
