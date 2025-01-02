import { asArray } from "@solid-primitives/utils";
import type { Container } from "pixi.js";
import { type ParentProps, children, onCleanup } from "solid-js";
import { usePortal } from "../context";
import { renderer } from "../jsx-runtime";

export function Portal(props: ParentProps<{ container?: Container }>) {
  const parent = usePortal() || props.container;

  if (!parent) return null;

  const c = children(() => props.children) as unknown as () =>
    | Container
    | Container[];
  renderer.insert(parent, c);

  onCleanup(() => {
    for (const child of asArray(c())) {
      parent.removeChild(child);
    }
  });
  return null;
}
