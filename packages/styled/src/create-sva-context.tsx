import {
  type Accessor,
  Component,
  createMemo,
  JSX,
  type ParentProps,
  splitProps as _splitProps,
  ComponentProps,
} from "solid-js";
import { Dynamic, DynamicProps, DynamicAttributes } from "@corvu/utils/dynamic";
import { createContextProvider } from "@solid-primitives/context";
import { SVAFn, SVAProps, SVAReturn } from "./sva";
import { T } from "ts-toolbelt";

type ValidComponent =
  | keyof JSX.IntrinsicElements
  | Component<any>
  | (string & {});
export type WithSVA<
  C extends ValidComponent,
  SVA extends SVAFn<any, any>,
  V extends SVA extends SVAFn<any, infer V> ? V : never = SVA extends SVAFn<
    any,
    infer V
  >
    ? V
    : never,
> = ComponentProps<C> & SVAProps<V> & { class?: string };

export function createSvaContext<Slots extends readonly string[], V>(
  svaFn: SVAFn<Slots, V>,
) {
  const createStyles = (props?: SVAProps<V>) => {
    return createMemo(() => svaFn(props)) as Accessor<SVAReturn<Slots>>;
  };

  const [StylesProvider, useContext] = createContextProvider<
    Accessor<SVAReturn<Slots>>,
    ParentProps<{
      sva?: SVAProps<V> | Accessor<SVAReturn<Slots>>;
    }>
  >(({ sva }) => (typeof sva === "function" ? sva : createStyles(sva)));

  function useStyles(
    slot: T.UnionOf<Slots>,
  ): SVAReturn<Slots>[T.UnionOf<Slots>];
  function useStyles(
    slot: T.UnionOf<Slots>,
    className: string | undefined,
  ): SVAReturn<Slots>[T.UnionOf<Slots>];

  function useStyles(): Accessor<SVAReturn<Slots>>;
  function useStyles(slot?: T.UnionOf<Slots>, className?: string | undefined) {
    const styles = useContext();

    return slot ? styles()[slot] + " " + className : styles;
  }

  const keys = [
    ...(Object.keys(
      svaFn.config.variants || [],
    ) as unknown as readonly (keyof SVAProps<V>)[]),
  ];

  const splitProps = <
    P extends
      | (SVAProps<V> & Record<string, any>)
      | DynamicProps<ValidComponent, SVAProps<V> & { class?: string }>,
  >(
    props: P,
  ) => {
    return _splitProps(props, keys) as unknown as [
      sva: SVAProps<V>,
      others: Omit<P, keyof SVAProps<V>>,
    ];
  };

  type WithSVA<C extends ValidComponent> = ComponentProps<C> &
    SVAProps<V> & { class?: string };

  const withRootProvider = <C extends ValidComponent>(component: C) => {
    const WithRootProvider = (props: WithSVA<C>) => {
      const [svaProps, others] = splitProps(props);
      return (
        <StylesProvider sva={svaProps}>
          <Dynamic as={component} {...others} />
        </StylesProvider>
      );
    };

    return WithRootProvider;
  };

  const withProvider = <C extends ValidComponent>(
    component: C,
    slot: T.UnionOf<Slots>,
  ) => {
    const WithProvider = (props: WithSVA<C>) => {
      const [svaProps, others] = splitProps(props);
      const sva = createStyles(svaProps);

      return (
        <StylesProvider sva={sva}>
          <Dynamic
            as={component}
            {...others}
            class={sva()?.[slot] + " " + props.class}
          />
        </StylesProvider>
      );
    };

    return WithProvider;
  };

  const withDynamicProvider = <C extends ValidComponent>(
    component: C,
    slot: T.UnionOf<Slots>,
  ) => {
    const WithDynamicProvider = <T extends ValidComponent = C>(
      props: WithSVA<C> & DynamicAttributes<T>,
    ) => {
      const [local, svaProps, others] = _splitProps(props, ["as"], keys);
      const sva = createStyles(svaProps as SVAProps<V>);

      return (
        <StylesProvider sva={sva}>
          <Dynamic
            as={local.as || component}
            {...others}
            class={sva()?.[slot] + " " + props.class}
          />
        </StylesProvider>
      );
    };

    return WithDynamicProvider;
  };

  const withContext = <C extends ValidComponent>(
    component: C,
    slot: T.UnionOf<Slots>,
  ) => {
    return (props: WithSVA<C>) => {
      const styles = useStyles(slot, props.class);

      return <Dynamic as={component} {...props} class={styles} />;
    };
  };

  const withDynamicContext = <C extends ValidComponent>(
    component: C,
    slot: T.UnionOf<Slots>,
  ) => {
    return (props: WithSVA<C> & DynamicAttributes<C>) => {
      const [local, others] = _splitProps(props, ["as"]);
      const styles = useStyles(slot, others.class);
      return <Dynamic as={local.as || component} {...others} class={styles} />;
    };
  };

  return {
    withRootProvider,
    withProvider,
    withContext,
    withDynamicProvider,
    withDynamicContext,
    useStyles: useStyles,
    StylesProvider: StylesProvider,
    keys,
  };
}
