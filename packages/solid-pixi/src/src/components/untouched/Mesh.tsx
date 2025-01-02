import { type MeshOptions, Mesh as pxMesh } from "pixi.js";
import { createEffect, onCleanup, splitProps, untrack } from "solid-js";
import { ParentContext, useParent } from "../../context";
import {
  CommonPropKeys,
  EventPropKeys,
  type GetCommonProps,
  type GetEventProps,
} from "../../types";

export type ExtendedMesh<Data extends object> = pxMesh & Data;
export type MeshProps<Data extends object> = GetCommonProps<
  ExtendedMesh<Data>
> &
  MeshOptions &
  GetEventProps &
  Data;

export function Mesh<Data extends object = object>(props: MeshProps<Data>) {
  const [ours, events, pixis] = splitProps(
    props,
    CommonPropKeys,
    EventPropKeys,
  );

  const mesh = (ours.as || new pxMesh(pixis)) as ExtendedMesh<Data>;

  createEffect(() => {
    for (const prop in pixis) {
      (Mesh as any)[prop] = (pixis as any)[prop];
    }
  });

  createEffect(() => {
    const cleanups = Object.entries(events).map(
      ([event, handler]: [any, any]) => {
        mesh.on(event, handler);
        return () => mesh.off(event, handler);
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
        cleanups = untrack(() => uses.map((fn) => fn(mesh)));
      } else {
        cleanups = untrack(() => [uses(mesh)]);
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup()),
    );
  });

  const parent = useParent();
  parent.addChild(mesh);
  onCleanup(() => {
    parent?.removeChild(mesh);
  });

  return (
    <ParentContext.Provider value={mesh}>
      {ours.children}
    </ParentContext.Provider>
  );
}
