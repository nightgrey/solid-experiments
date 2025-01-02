import {
  type JSX,
  type ValidComponent,
  mergeProps,
  splitProps,
  createMemo,
} from "solid-js";
import { CVAFn, CVAProps } from "./cva";
import { Dynamic, type DynamicProps } from "./dynamic";

// @TODO: Infer `StyledProps` + generic T?
export type StyledComponent<T extends ValidComponent, V> = <
  As extends ValidComponent = T,
>(
  props: StyledProps<As, V>,
) => JSX.Element;
export type StyledProps<T extends ValidComponent, V> = DynamicProps<
  T,
  CVAProps<V>
>;

// Note: Do not type this properly using generics. It kills the TS language server to the point where it starts freezing and consuming multiple GB's of memory.
// I traced it and the reason seems to be related to JSX.IntrinsicElements.
const factory = (component: ValidComponent) => {
  return (cva: CVAFn<unknown>, defaultProps?: Record<string, unknown>) => {
    const cvaPropKeys = Object.keys(
      cva?.config?.variants ?? {},
    ) as (keyof CVAProps<unknown>)[];

    const Styled: StyledComponent<ValidComponent, unknown> = (props) => {
      const [cvaProps, other] = splitProps(mergeProps(defaultProps, props), [
        ...cvaPropKeys,
        "class",
      ]);

      const style = createMemo(() => cva(cvaProps));

      return (
        <Dynamic
          {...(other as DynamicProps<ValidComponent, object>)}
          class={style()}
        />
      );
    };

    return Styled;
  };
};

export type Factory<T extends ValidComponent> = <V>(
  cva: CVAFn<V>,
  defaultProps?: StyledProps<T, V>,
) => StyledComponent<T, V>;

export type Styled = {
  [T in keyof JSX.IntrinsicElements]: Factory<T>;
} & (<T extends ValidComponent>(component: T) => Factory<T>);

/**
 * Creates a `styled` component
 *
 * @example
 * ```tsx
 * const button = cva({ base: "button", variants: { primary: { bg: "red" } } });
 * const Button = styled.button(button);
 *
 * const Component = () => <Button variant="primary" />
 * const Component = () => <Button as="a" variant="primary" />
 * const Component = () => <Button asChild={props => <a {...props} />} variant="primary" />
 * ```
 */
export const styled = new Proxy(factory, {
  get(factory, component) {
    return factory(component as string);
  },
}) as Styled;
