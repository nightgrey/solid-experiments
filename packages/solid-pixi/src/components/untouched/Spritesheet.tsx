import {
  type JSX,
  Show,
  Suspense,
  createContext,
  createMemo,
  createResource,
  splitProps,
  useContext,
} from "solid-js";
import {
  type BindableTexture,
  type SpritesheetData,
  Spritesheet as pxSpritesheet,
} from "pixi.js";

import { CommonPropKeys, type GetCommonProps } from "../../types.ts";

export type ExtendedSpritesheet<
  S extends SpritesheetData,
  Data extends object,
> = pxSpritesheet<S> & Data;
export type SpritesheetProps<
  S extends SpritesheetData,
  Data extends object,
> = GetCommonProps<ExtendedSpritesheet<S, Data>> & {
  texture: BindableTexture;
  data: S;
  fallback?: JSX.Element;
} & Data;

type ResourceSignal<S extends SpritesheetData, D extends object> = [
  SpritesheetProps<S, D>["as"] | undefined,
  BindableTexture,
  S,
];

export const SpritesheetContext =
  createContext<ExtendedSpritesheet<Solid.SpritesheetData, object>>();
export function useSpritesheet<
  S extends SpritesheetData = SpritesheetData,
  D extends object = object,
>() {
  return useContext(SpritesheetContext) as ExtendedSpritesheet<S, D>;
}

export function SpriteSheet<
  S extends SpritesheetData = SpritesheetData,
  Data extends object = object,
>(props: SpritesheetProps<S, Data>) {
  const [ours, pixis] = splitProps(props, [...CommonPropKeys, "fallback"]);

  const args = createMemo<ResourceSignal<S, Data>>(() => [
    ours.as,
    pixis.texture,
    pixis.data,
  ]);

  const [spritesheet] = createResource<
    ExtendedSpritesheet<S, Data>,
    ResourceSignal<S, Data>
  >(
    args,
    async ([as, texture, data]) => {
      const sheet = (as ||
        new pxSpritesheet(texture, data)) as ExtendedSpritesheet<S, Data>;
      await sheet.parse();
      return sheet;
    },
    { initialValue: ours.as },
  );

  return (
    <Suspense fallback={ours.fallback}>
      <Show when={spritesheet()}>
        <Solid.SpritesheetContext.Provider value={spritesheet()}>
          {ours.children}
        </Solid.SpritesheetContext.Provider>
      </Show>
    </Suspense>
  );
}
