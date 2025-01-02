import { Text as PixiText, type TextOptions, type TextString } from "pixi.js";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { useParent } from "../../context";
import {
  CommonPropKeys,
  EventPropKeys,
  type GetCommonProps,
  type GetEventProps,
} from "../../types";

export type TextProps = Omit<GetCommonProps<PixiText>, "children"> &
  Omit<TextOptions, "text" | "children"> &
  GetEventProps & {
    children: TextString;
  };

export function Text(props: TextProps) {
  const [ours, events, pixis] = splitProps(
    props,
    CommonPropKeys.concat("children"),
    EventPropKeys,
  );
  const text = (ours.as || new PixiText(pixis)) as PixiText;

  createEffect(() => {
    text.text = ours.children;
  });

  createEffect(() => {
    for (const prop in pixis) {
      (text as any)[prop] = (pixis as any)[prop];
    }
  });

  createEffect(() => {
    const cleanups = Object.entries(events).map(
      ([event, handler]: [any, any]) => {
        text.on(event, handler);
        return () => text.off(event, handler);
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
        cleanups = uses.map((fn) => fn(text));
      } else {
        cleanups = [uses(text)];
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup()),
    );
  });

  const parent = useParent();
  parent.addChild(text);
  onCleanup(() => {
    parent?.removeChild(text);
  });

  return null;
}
