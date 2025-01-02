import {
  ComponentProps,
  JSX,
  splitProps,
  untrack,
  ValidComponent,
} from "solid-js";
import {
  DynamicAttributes as CorvuDynamicAttributes,
  Dynamic as CorvuDynamic,
} from "@corvu/utils/dynamic";
type OverrideProps<T, P> = Omit<T, keyof P> & P;

export type DynamicAttributes<T extends ValidComponent> =
  CorvuDynamicAttributes<T> & {
    /* @TODO: Make `asChild` prop different or configurable? */
    asChild?: (props: JSX.HTMLAttributes<any>) => JSX.Element;
  };

export type DynamicProps<
  T extends ValidComponent,
  Props extends object,
> = OverrideProps<ComponentProps<T>, Props & DynamicAttributes<T>>;

/**
 * A <Dynamic> component combining `@corvu/utils/dynamic` with an `asChild` prop.

 */
export const Dynamic = <T extends ValidComponent, Props extends object>(
  props: DynamicProps<T, Props>,
) => {
  const [local, other] = splitProps(props, ["as", "asChild"]);

  if (local.asChild) return untrack(() => local.asChild(other));

  return <CorvuDynamic as={local.as} {...other} />;
};
