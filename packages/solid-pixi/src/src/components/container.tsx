import { Container as PixiContainer } from "pixi.js";
import { splitProps } from "solid-js";
import { renderer } from "../jsx-runtime";
import { ContainerPropKeys, type ContainerProps } from "../types";

export const Container = (props: ContainerProps) => {
  const [common, pixis] = splitProps(props, ContainerPropKeys.common);

  const as = common.as || new PixiContainer(pixis);
  renderer.spread(as, pixis);
  renderer.insert(as, () => common.children);
  return as;
};

export const SolidContainer = Container;
