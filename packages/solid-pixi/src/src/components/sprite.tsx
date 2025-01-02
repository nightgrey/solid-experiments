import { Sprite as PixiSprite } from "pixi.js";
import { splitProps } from "solid-js";
import { renderer } from "../jsx-runtime";
import { SpritePropKeys, type SpriteProps } from "../types";

export function Sprite(props: SpriteProps) {
  const [common, pixis] = splitProps(props, SpritePropKeys.common);

  const as = common.as || new PixiSprite(pixis);

  renderer.spread(as, pixis);
  renderer.insert(as, () => common.children);

  return as;
}
export const SolidSprite = Sprite;
