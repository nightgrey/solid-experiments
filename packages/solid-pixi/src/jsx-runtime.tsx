import { Container, Graphics, Sprite, Text } from "pixi.js";
import { createRenderEffect } from "solid-js";
import { createRenderer } from "solid-js/universal";
import type { C } from "ts-toolbelt";
import type { ComponentProps, PixiClass } from "./types.ts";

const _renderer = createRenderer<C.Instance<PixiClass>>({
  createElement(string) {
    switch (string.toLowerCase()) {
      case "container":
        return new Container();
      case "sprite":
        return new Sprite();
      case "graphics":
        return new Graphics();
      case "text":
        return new Text();
      default:
        return new Container();
    }
  },
  createTextNode(value) {
    return new Text(value);
  },
  replaceText(textNode: Text, value) {
    textNode.text = value;
  },
  setProperty(node, name, value, prev) {
    if (name !== "size") {
      // @ts-expect-error
      node[name] = value;
    } else {
      // @ts-expect-error
      node.setSize(value?.width, value?.height);
    }
  },
  insertNode(parent, node, anchor) {
    if (anchor) {
      parent.addChildAt(node, anchor?.parent.children.indexOf(anchor));
    } else {
      parent.addChild(node);
    }
  },
  isTextNode(node) {
    return node.constructor.name === "Text";
  },
  removeNode(_, node) {
    node.removeFromParent();
  },
  getParentNode(node) {
    return node.parent;
  },
  getFirstChild(node) {
    return node.children[0];
  },
  getNextSibling(node) {
    return node.parent?.children[node.parent.children.indexOf(node) + 1];
  },
});

function spreadExpression<T extends ComponentProps<PixiClass>>(
  node: any,
  props: T = {} as T,
  prevProps: T = {} as T,
) {
  let renderable = props?.renderable ?? true;
  createRenderEffect(() => props.ref?.(node));
  createRenderEffect(() => {
    // Makes sure that we render one last time before the component's `renderable` prop is set to `true`, and then
    // stops until its `renderable` prop is set to `false` again.
    if (!renderable && props.renderable === false) return;
    for (const prop in props) {
      if (prop === "children" || prop === "ref") continue;
      const value = props[prop];
      if (value === prevProps[prop]) continue;
      _renderer.setProp(node, prop, value, prevProps[prop]);
      prevProps[prop] = value;
    }

    renderable = props.renderable ?? true;
  });
  return prevProps;
}
export function _spread<T>(node: any, accessor: T | (() => T)) {
  if (typeof accessor === "function") {
    createRenderEffect((current) =>
      // @ts-expect-error
      spreadExpression(node, accessor(), current),
    );
    // @ts-expect-error
  } else spreadExpression(node, accessor, undefined);
}

export const renderer = {
  ..._renderer,
  spread: _spread,
};

export const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
  use,
} = renderer;

// Forward Solid control flow
export {
  For,
  Show,
  Suspense,
  SuspenseList,
  Switch,
  Match,
  Index,
  ErrorBoundary,
} from "solid-js";
