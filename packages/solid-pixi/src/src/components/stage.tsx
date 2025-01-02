import { splitProps } from "solid-js";
import { useApplication } from "../context";
import { renderer } from "../jsx-runtime";
import { StagePropKeys, type StageProps } from "../types";

export const Stage = (props: StageProps) => {
  const app = useApplication();
  const [common, pixis] = splitProps(props, StagePropKeys.common);

  const as = app.stage;

  renderer.spread(as, pixis);
  renderer.insert(as, () => common.children);

  return as;
};

export const SolidStage = Stage;
