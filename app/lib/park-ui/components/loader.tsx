"use client";
import { forwardRef } from "react";
import { css, cx } from "styled-system/css";
import { type HTMLStyledProps, styled } from "styled-system/jsx";
import { AbsoluteCenter } from "./absolute-center";
import { Spinner } from "./spinner";

export interface LoaderProps extends HTMLStyledProps<"span"> {
  /**
   * Whether the loader is visible
   * @default true
   */
  visible?: boolean | undefined;
  /**
   * The spinner to display when loading
   */
  spinner?: React.ReactNode | undefined;
  /**
   * The placement of the spinner
   * @default "start"
   */
  spinnerPlacement?: "start" | "end" | undefined;
  /**
   * The text to display when loading
   */
  text?: React.ReactNode | undefined;

  children?: React.ReactNode;
}

const Span = styled("span");

export const Loader = forwardRef<HTMLSpanElement, LoaderProps>(
  function Loader(props, ref) {
    const {
      spinner = (
        <Spinner
          size="inherit"
          css={{ borderWidth: "0.125em", color: "inherit" }}
        />
      ),
      spinnerPlacement = "start",
      children,
      className,
      text,
      visible = true,
      ...rest
    } = props;

    const klassName = cx(css({ display: "contents" }), className);

    if (!visible) return children;

    if (text) {
      return (
        <Span ref={ref} className={klassName} {...rest}>
          {spinnerPlacement === "start" && spinner}
          {text}
          {spinnerPlacement === "end" && spinner}
        </Span>
      );
    }

    if (spinner) {
      return (
        <Span ref={ref} className={klassName} {...rest}>
          <AbsoluteCenter className={css({ display: "inline-flex" })}>
            {spinner}
          </AbsoluteCenter>
          <Span className={css({ display: "contents", visibility: "hidden" })}>
            {children}
          </Span>
        </Span>
      );
    }

    return (
      <Span ref={ref} className={klassName} {...rest}>
        {children}
      </Span>
    );
  }
);
