"use client";
import {
  Children,
  cloneElement,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { css, cx } from "styled-system/css";
import type { BoxProps } from "styled-system/jsx";
import type { SystemStyleObject } from "styled-system/types";
import { Group } from "./group";
import { InputAddon, type InputAddonProps } from "./input-addon";
import { InputElement, type InputElementProps } from "./input-element";

export interface InputGroupProps extends BoxProps {
  /**
   * The props to pass to the start element
   */
  startElementProps?: InputElementProps | undefined;
  /**
   * The props to pass to the end element
   */
  endElementProps?: InputElementProps | undefined;
  /**
   * The start element to render the inner left of the group
   */
  startElement?: ReactNode | undefined;
  /**
   * The end element to render the inner right of the group
   */
  endElement?: ReactNode | undefined;
  /**
   * The start addon to render the left of the group
   */
  startAddon?: ReactNode | undefined;
  /**
   * The props to pass to the start addon
   */
  startAddonProps?: InputAddonProps | undefined;
  /**
   * The end addon to render the right of the group
   */
  endAddon?: ReactNode | undefined;
  /**
   * The props to pass to the end addon
   */
  endAddonProps?: InputAddonProps | undefined;
  /**
   * The children to render inside the group
   */
  children: ReactElement<InputElementProps>;
  /**
   * The offset to apply to the start element
   */
  startOffset?: SystemStyleObject["paddingStart"] | undefined;
  /**
   * The offset to apply to the end element
   */
  endOffset?: SystemStyleObject["paddingEnd"] | undefined;
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      className,
      startElement,
      startElementProps,
      endElement,
      endElementProps,
      startAddon,
      startAddonProps,
      endAddon,
      endAddonProps,
      children,
      startOffset = "0px",
      endOffset = "0px",
      ...rest
    } = props;

    const child = Children.only<ReactElement<InputElementProps>>(children);
    const attached = Boolean(startAddon || endAddon);

    const groupClassName = cx(css({ _icon: { boxSize: "5" } }), className);
    const startElementClassName = cx(
      css({ pointerEvents: "none" }),
      startElementProps?.className
    );
    
    const inputClassName = cx(
      child.props.className,
      css({
        ...(startElement && {
          ps: `calc(var(--input-height) - ${startOffset})`,
        }),
        ...(endElement && { pe: `calc(var(--input-height) - ${endOffset})` }),
      })
    );

    return (
      <Group
        ref={ref}
        attached={attached}
        className={groupClassName}
        skip={(el) => el.type === InputElement}
        {...rest}
      >
        {startAddon && (
          <InputAddon {...startAddonProps}>{startAddon}</InputAddon>
        )}
        {startElement && (
          <InputElement
            {...startElementProps}
            className={startElementClassName}
          >
            {startElement}
          </InputElement>
        )}
        {cloneElement(child, { ...children.props, className: inputClassName })}
        {endElement && (
          <InputElement placement="end" {...endElementProps}>
            {endElement}
          </InputElement>
        )}
        {endAddon && <InputAddon {...endAddonProps}>{endAddon}</InputAddon>}
      </Group>
    );
  }
);
