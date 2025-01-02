// Inspired by https://panda-css.com/docs/concepts/slot-recipes
import { type CVAConfig, cva, type StringToBoolean } from "./cva";
import { cx, type ClassValue } from "./cx";

type TupleToUnion<T extends readonly string[]> = T[number];

type SVAConfigBase<Slots extends readonly string[]> = {
  class?: string;
  slots: Slots;
  base?: Partial<Record<TupleToUnion<Slots>, ClassValue>>;
};

export type SVAVariantShape<Slots extends readonly string[]> = Record<
  string,
  Record<string, Partial<Record<TupleToUnion<Slots>, ClassValue>>>
>;

type SVAVariantSchema<V extends SVAVariantShape<any>> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined;
};

export type SVAConfig<
  Slots extends readonly string[],
  V,
> = V extends SVAVariantShape<Slots>
  ? SVAConfigBase<Slots> & {
      variants?: V;
      compoundVariants?: ((
        | SVAVariantSchema<V>
        | {
            [Variant in keyof V]?:
              | StringToBoolean<keyof V[Variant]>
              | StringToBoolean<keyof V[Variant]>[]
              | undefined;
          }
      ) & {
        class?: Partial<Record<TupleToUnion<Slots>, string>>;
      })[];
      defaultVariants?: SVAVariantSchema<V>;
    }
  : SVAConfigBase<Slots> & {
      variants?: never;
      compoundVariants?: never;
      defaultVariants?: never;
    };

export type SVAProps<V> = V extends SVAVariantShape<any>
  ? SVAVariantSchema<V>
  : {};

type CVAVariants<Variants> = {
  [K in keyof Variants]: Record<keyof Variants[K], string>;
};

const getSlotCvaConfigs = <Slots extends readonly string[], V>(
  config: SVAConfig<Slots, V>,
): Record<TupleToUnion<Slots>, CVAConfig<CVAVariants<V>>> => {
  const result = Object.create(null);
  const slots = config.slots;
  const defaultVariants = config.defaultVariants ?? {};

  for (const slot of slots) {
    const compoundVariants =
      config.compoundVariants?.reduce((acc, cv) => {
        if (cv.class?.[slot as TupleToUnion<Slots>]) {
          acc.push({ ...cv, class: cv.class[slot as TupleToUnion<Slots>] });
        }
        return acc;
      }, [] as any[]) ?? [];

    result[slot] = {
      base: config.base?.[slot as TupleToUnion<Slots>] ?? {},
      variants: {},
      defaultVariants,
      compoundVariants,
    };
  }

  if (config.variants) {
    for (const [variant, definition] of Object.entries(config.variants)) {
      for (const [value, slotValues] of Object.entries(definition)) {
        for (const slot of slots) {
          (result[slot].variants[variant] ??= {})[value] =
            slotValues[slot as TupleToUnion<Slots>] ?? [];
        }
      }
    }
  }

  return result;
};

export type SVAReturn<Slots extends readonly string[]> = Record<
  TupleToUnion<Slots>,
  string
>;

export type SVAFn<Slots extends readonly string[], V> = {
  (props?: SVAProps<V>): SVAReturn<Slots>;
  config: SVAConfig<Slots, V>;
};

export type SVA = <Slots extends readonly string[], V>(
  config: SVAConfig<Slots, V>,
) => SVAFn<Slots, V>;

export const sva: SVA = <Slots extends readonly string[], V>(
  config: SVAConfig<Slots, V>,
) => {
  const slots = getSlotCvaConfigs(config);
  const cvas = new Map(
    Object.entries(slots).map(([slot, conf]) => [slot, cva(conf as CVAConfig<any>)]),
  );
  const prefixes = config.class
    ? new Map(config.slots.map((slot) => [slot, `${config.class}_${slot}`]))
    : null;

  const svaFn = ((props?: SVAProps<V>): SVAReturn<Slots> => {
    const result = Object.create(null);

    for (const slot of config.slots) {
      const cvaFn = cvas.get(slot)!;
      const prefix = prefixes?.get(slot);
      result[slot] = prefix ? cx(prefix, cvaFn(props)) : cvaFn(props);
    }

    return result;
  }) as SVAFn<Slots, V>;

  svaFn.config = config;
  return svaFn;
};
