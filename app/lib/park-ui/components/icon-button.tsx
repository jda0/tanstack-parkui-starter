import { forwardRef } from "react";
import { Button, type ButtonProps } from "./button";
import { css, cx } from "styled-system/css";

export interface IconButtonProps extends ButtonProps {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const { className, ...rest } = props;
    const klassName = cx(css({ px: 0, py: 0 }), className);
    return <Button className={klassName} ref={ref} {...rest} />;
  }
);
