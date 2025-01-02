// Modified from https://github.com/joe-bell/cva/blob/main/packages/cva/src/index.ts

/**
 * Copyright 2022 Joe Bell. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
import { type ClassValue, cx } from "./cx";
import { type U } from "ts-toolbelt";
/* Utils
  ---------------------------------- */

type OmitUndefined<T> = T extends undefined ? never : T;
export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;
type UnionToIntersection<U> = U.IntersectOf<U>;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class"
>;

/* compose
  ---------------------------------- */

export type Compose = <T extends CVAFn<any>[]>(
  ...components: [...T]
) => ComposeFn<T>;

export type ComposeFn<T extends CVAFn<any>[]> = (
  props?: (
    | UnionToIntersection<
        {
          [K in keyof T]: VariantProps<T[K]>;
        }[number]
      >
    | undefined
  ) &
    CVAClassProp,
) => string;

/* cva
  ============================================ */

export type CVAConfigBase = { base?: ClassValue };
export type CVAVariantShape = Record<string, Record<string, ClassValue>>;
export type CVAVariantSchema<V extends CVAVariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined;
};
export type CVAClassProp = {
  class?: string;
};

export type CVAConfig<V> = V extends CVAVariantShape
  ? CVAConfigBase & {
      variants?: V;
      compoundVariants?: (V extends CVAVariantShape
        ? (
            | CVAVariantSchema<V>
            | {
                [Variant in keyof V]?:
                  | StringToBoolean<keyof V[Variant]>
                  | StringToBoolean<keyof V[Variant]>[]
                  | undefined;
              }
          ) &
            CVAClassProp
        : CVAClassProp)[];
      defaultVariants?: CVAVariantSchema<V>;
    }
  : CVAConfigBase & {
      variants?: never;
      compoundVariants?: never;
      defaultVariants?: never;
    };

export type CVAProps<V> = V extends CVAVariantShape
  ? CVAVariantSchema<V> & CVAClassProp
  : CVAClassProp;

export type CVA = <V>(config: CVAConfig<V>) => CVAFn<V>;

export type CVAFn<V> = ((props?: CVAProps<V>) => string) & {
  config: CVAConfig<V>;
};

/* Exports
  ============================================ */

const falsyToString = <T>(value: T) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

export const cva: CVA = <V>(config: CVAConfig<V>) => {
  const fn = (cvaProps?: CVAProps<V>) => {
    if (config?.variants == null) return cx(config?.base, cvaProps?.class);

    const { variants, defaultVariants } = config;
    const variantKeys = Object.keys(variants);
    const len = variantKeys.length;
    const classNames = new Array(len).fill(null);

    for (let i = 0; i < len; i++) {
      const variant = variantKeys[i];
      const variantProp = cvaProps?.[variant as keyof typeof cvaProps];
      const defaultVariantProp = defaultVariants?.[variant];

      const variantKey = (falsyToString(variantProp) ||
        falsyToString(
          defaultVariantProp,
        )) as keyof (typeof variants)[typeof variant];

      classNames[i] = variants[variant][variantKey];
    }

    let props;
    if (config.compoundVariants?.length) {
      props = Object.create(null);
      for (const key in defaultVariants) {
        props[key] = defaultVariants[key];
      }
      if (cvaProps) {
        for (const key in cvaProps) {
          const value = cvaProps[key];
          if (value !== undefined) {
            props[key] = value;
          }
        }
      }
    }

    // Handle compound variants
    let compoundClasses;
    if (config.compoundVariants?.length) {
      compoundClasses = [];
      for (const { class: cvClass, ...cvConfig } of config.compoundVariants) {
        let matches = true;
        for (const [cvKey, cvSelector] of Object.entries(cvConfig)) {
          const selector = props[cvKey];
          if (
            Array.isArray(cvSelector)
              ? !cvSelector.includes(selector)
              : selector !== cvSelector
          ) {
            matches = false;
            break;
          }
        }
        if (matches) {
          compoundClasses.push(cvClass);
        }
      }
    }

    return cx(config?.base, classNames, compoundClasses, cvaProps?.class);
  };
  fn.config = config;
  return fn;
};

export const compose: Compose =
  (...components) =>
  (props) => {
    const propsWithoutClass = Object.fromEntries(
      Object.entries(props || {}).filter(([key]) => !["class"].includes(key)),
    );

    return cx(
      components.map((component) => component(propsWithoutClass)),
      props?.class,
    );
  };
