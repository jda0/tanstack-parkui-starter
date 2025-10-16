import { ark } from "@ark-ui/react/factory";
import { type ComponentProps, forwardRef } from "react";
import { css, cx } from "styled-system/css";
import { Stack, type StackProps, styled } from "styled-system/jsx";
import { skeleton } from "styled-system/recipes";

export type SkeletonProps = ComponentProps<typeof Skeleton>;
export const Skeleton = styled(ark.div, skeleton);

export type SkeletonCircleProps = ComponentProps<typeof SkeletonCircle>;
export const SkeletonCircle = styled(ark.div, skeleton, {
  defaultProps: { circle: true },
});

export interface SkeletonTextProps extends SkeletonProps {
  /**
   * Gap between each line
   * @default "0.5rem"
   */
  gap?: StackProps["gap"];

  /**
   * Number of lines to display
   * @default 3
   */
  noOfLines?: number | undefined;
  rootProps?: StackProps | undefined;
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(props, ref) {
    const {
      className,
      noOfLines = 3,
      gap,
      rootProps,
      ...skeletonProps
    } = props;

    const stackClassName = cx(css({ width: "full" }), rootProps?.className);
    const skeletonClassName = cx(
      css({ _last: { maxW: noOfLines === 1 ? "100%" : "80%" }, height: 4 }),
      className
    );

    return (
      <Stack ref={ref} className={stackClassName} gap={gap} {...rootProps}>
        {[...Array(noOfLines).keys()].map((index) => (
          <Skeleton
            key={index}
            {...skeletonProps}
            className={skeletonClassName}
          />
        ))}
      </Stack>
    );
  }
);
