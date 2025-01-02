import { Graphics as PixiGraphics } from "pixi.js";
import { splitProps } from "solid-js";
import { renderer } from "../jsx-runtime";
import { GraphicsPropKeys, type GraphicsProps } from "../types";

export function Graphics(props: GraphicsProps) {
  const [common, pixis] = splitProps(props, GraphicsPropKeys.common);

  const as = common.as || new PixiGraphics(pixis);
  renderer.spread(as, pixis);
  renderer.insert(as, () => common.children);

  return as;
}

export const SolidGraphics = Graphics;
