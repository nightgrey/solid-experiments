import {
  type FrameObject,
  type Texture,
  AnimatedSprite as pxAnimatedSprite,
} from "pixi.js";
import { createEffect, onCleanup, splitProps, untrack } from "solid-js";
import { ParentContext, useParent } from "../../context.ts";
import {
  CommonPropKeys,
  EventPropKeys,
  type GetCommonProps,
  type GetEventProps,
} from "../../types.ts";

export type ExtendedAnimatedSprite<Data extends object> = pxAnimatedSprite &
  Data;
export type AnimatedSpriteProps<Data extends object> = GetCommonProps<
  pxAnimatedSprite,
  Data
> &
  Omit<Solid.SpriteOptions, "texture"> & {
    textures: Texture[] | FrameObject[];
    autoUpdate?: boolean;
    animationSpeed?: number;
    loop?: boolean;
    updateAnchor?: boolean;
    onComplete?: () => void;
    onFrameChange?: (currentFrame: number) => void;
    onLoop?: () => void;
  } & GetEventProps &
  Data;

export function AnimatedSprite<Data extends object = object>(
  props: AnimatedSpriteProps<Data>,
) {
  const [ours, events, pixis] = splitProps(
    props,
    CommonPropKeys,
    EventPropKeys,
  );

  const sprite = (ours.as ||
    new pxAnimatedSprite(
      pixis.textures,
      pixis.autoUpdate,
    )) as ExtendedAnimatedSprite<Data>;

  createEffect(() => {
    for (const prop in pixis) {
      (sprite as any)[prop] = (pixis as any)[prop];
    }
  });

  createEffect(() => {
    const cleanups = Object.entries(events).map(
      ([event, handler]: [any, any]) => {
        sprite.on(event, handler);
        return () => sprite.off(event, handler);
      },
    );

    onCleanup(() => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    });
  });

  createEffect(() => {
    let cleanups: (void | (() => void))[] = [];
    const uses = props.uses;
    if (uses) {
      if (Array.isArray(uses)) {
        cleanups = untrack(() => uses.map((fn) => fn(sprite)));
      } else {
        cleanups = untrack(() => [uses(sprite)]);
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup()),
    );
  });

  const parent = useParent();
  parent.addChild(sprite);
  onCleanup(() => {
    parent?.removeChild(sprite);
  });

  return (
    <ParentContext.Provider value={sprite}>
      {ours.children}
    </ParentContext.Provider>
  );
}
