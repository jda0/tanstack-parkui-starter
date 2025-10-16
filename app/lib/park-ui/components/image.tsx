import { forwardRef } from "react";
import { css, cx } from "styled-system/css";
import { styled } from "styled-system/jsx";
import type { HTMLStyledProps, SystemStyleObject } from "styled-system/types";

interface ImageOptions {
  /**
   * How the image to fit within its bounds.
   * It maps to css `object-fit` property.
   * @type SystemStyleObject["objectFit"]
   */
  fit?: SystemStyleObject["objectFit"] | undefined;
  /**
   * How to align the image within its bounds.
   * It maps to css `object-position` property.
   * @type SystemStyleObject["objectPosition"]
   */
  align?: SystemStyleObject["objectPosition"] | undefined;
}

export interface ImageProps extends HTMLStyledProps<"img">, ImageOptions {}

const StyledImage = styled("img");

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  function Image(props, ref) {
    const { align, className, fit = "cover", ...rest } = props;
    const klassName = cx(
      css({ objectFit: fit, objectPosition: align }),
      className
    );

    return <StyledImage className={klassName} ref={ref} {...rest} />;
  }
);
