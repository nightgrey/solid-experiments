import type {
  Application,
  ApplicationOptions,
  Container,
  ContainerChild,
  ContainerOptions,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Graphics,
  GraphicsOptions,
  Size,
  Sprite,
  SpriteOptions,
  Text,
  TextOptions,
} from "pixi.js";
import type { JSX } from "solid-js";
import type { C, O } from "ts-toolbelt";

// Events
export type PixiContainerClass<Child extends ContainerChild = ContainerChild> =
  C.Class<[ContainerOptions], Container<Child>>;
export type PixiGraphicsClass = C.Class<[GraphicsOptions], Graphics>;
export type PixiSpriteClass = C.Class<[SpriteOptions], Sprite>;
export type PixiTextClass = C.Class<[TextOptions], Text>;
export type PixiApplicationClass = C.Class<[ApplicationOptions], Application>;
export type PixiClass =
  | PixiContainerClass
  | PixiGraphicsClass
  | PixiSpriteClass
  | PixiTextClass;

// /** Component event props */
// export type GetEventProps<I extends PixiClass> = I extends PixiContainerClass
//   ? {
//     added?: (container: Container<ContainerChild>) => void;
//     childAdded?: (
//       child: Container<ContainerChild>,
//       container: Container<ContainerChild>,
//       index: number,
//     ) => void;
//     removed?: (container: Container<ContainerChild>) => void;
//     childRemoved?: (
//       child: Container<ContainerChild>,
//       container: Container<ContainerChild>,
//       index: number,
//     ) => void;
//     destroyed?: () => void;
//   } & EventProps
//   : EventProps;

// // /** Additional component props; for compatibility or making functionality accessible in Solid.js */
// // type GetAdditionalCommonProps<I extends PixiClass> = I extends PixiGraphicsClass
// //   ? {
// //     draw?: DrawCalls;
// //     size?: Size;
// //   }
// //   : I extends PixiApplicationClass
// //   ? {
// //     ref?: (app: Application) => void;
// //   }
// //   : {
// //     size?: Size;
// //   };

// export const GetAdditionalCommonPropKeys = <I extends PixiClass>(
//   type: I,
// ): ReadonlyArray<keyof GetAdditionalCommonProps<I>> => {
//   if (type === PixiGraphics) {
//     return ["draw"] as ReadonlyArray<keyof GetAdditionalCommonProps<I>>;
//   }

//   if (type === PixiApplication) {
//     return ["ref"] as ReadonlyArray<keyof GetAdditionalCommonProps<I>>;
//   }

//   return [] as const as ReadonlyArray<keyof GetAdditionalCommonProps<I>>;
// };
export interface EventProps {
  click?: (event: FederatedPointerEvent) => void;
  clickcapture?: (event: FederatedPointerEvent) => void;
  mousedown?: (event: FederatedPointerEvent) => void;
  mousedowncapture?: (event: FederatedPointerEvent) => void;
  mouseenter?: (event: FederatedPointerEvent) => void;
  mouseentercapture?: (event: FederatedPointerEvent) => void;
  mouseleave?: (event: FederatedPointerEvent) => void;
  mouseleavecapture?: (event: FederatedPointerEvent) => void;
  mousemove?: (event: FederatedPointerEvent) => void;
  mousemovecapture?: (event: FederatedPointerEvent) => void;
  mouseout?: (event: FederatedPointerEvent) => void;
  mouseoutcapture?: (event: FederatedPointerEvent) => void;
  mouseover?: (event: FederatedPointerEvent) => void;
  mouseovercapture?: (event: FederatedPointerEvent) => void;
  mouseup?: (event: FederatedPointerEvent) => void;
  mouseupcapture?: (event: FederatedPointerEvent) => void;
  mouseupoutside?: (event: FederatedPointerEvent) => void;
  mouseupoutsidecapture?: (event: FederatedPointerEvent) => void;
  pointercancel?: (event: FederatedPointerEvent) => void;
  pointercancelcapture?: (event: FederatedPointerEvent) => void;
  pointerdown?: (event: FederatedPointerEvent) => void;
  pointerdowncapture?: (event: FederatedPointerEvent) => void;
  pointerenter?: (event: FederatedPointerEvent) => void;
  pointerentercapture?: (event: FederatedPointerEvent) => void;
  pointerleave?: (event: FederatedPointerEvent) => void;
  pointerleavecapture?: (event: FederatedPointerEvent) => void;
  pointermove?: (event: FederatedPointerEvent) => void;
  pointermovecapture?: (event: FederatedPointerEvent) => void;
  pointerout?: (event: FederatedPointerEvent) => void;
  pointeroutcapture?: (event: FederatedPointerEvent) => void;
  pointerover?: (event: FederatedPointerEvent) => void;
  pointerovercapture?: (event: FederatedPointerEvent) => void;
  pointertap?: (event: FederatedPointerEvent) => void;
  pointertapcapture?: (event: FederatedPointerEvent) => void;
  pointerup?: (event: FederatedPointerEvent) => void;
  pointerupcapture?: (event: FederatedPointerEvent) => void;
  pointerupoutside?: (event: FederatedPointerEvent) => void;
  pointerupoutsidecapture?: (event: FederatedPointerEvent) => void;
  rightclick?: (event: FederatedPointerEvent) => void;
  rightclickcapture?: (event: FederatedPointerEvent) => void;
  rightdown?: (event: FederatedPointerEvent) => void;
  rightdowncapture?: (event: FederatedPointerEvent) => void;
  rightup?: (event: FederatedPointerEvent) => void;
  rightupcapture?: (event: FederatedPointerEvent) => void;
  rightupoutside?: (event: FederatedPointerEvent) => void;
  rightupoutsidecapture?: (event: FederatedPointerEvent) => void;
  tap?: (event: FederatedPointerEvent) => void;
  tapcapture?: (event: FederatedPointerEvent) => void;
  touchcancel?: (event: FederatedPointerEvent) => void;
  touchcancelcapture?: (event: FederatedPointerEvent) => void;
  touchend?: (event: FederatedPointerEvent) => void;
  touchendcapture?: (event: FederatedPointerEvent) => void;
  touchendoutside?: (event: FederatedPointerEvent) => void;
  touchendoutsidecapture?: (event: FederatedPointerEvent) => void;
  touchmove?: (event: FederatedPointerEvent) => void;
  touchmovecapture?: (event: FederatedPointerEvent) => void;
  touchstart?: (event: FederatedPointerEvent) => void;
  touchstartcapture?: (event: FederatedPointerEvent) => void;
  wheel?: (event: FederatedWheelEvent) => void;
  wheelcapture?: (event: FederatedWheelEvent) => void;
}

export type GetPixiInstanceProps<I extends PixiClass> = Partial<
  O.Omit<C.Parameters<I>[0], "children">
>;

export type CompatibilityProps = {
  size?: Size;
};
export type ComponentProps<I extends PixiClass> = GetCommonProps<I> &
  GetPixiInstanceProps<I> &
  EventProps &
  CompatibilityProps;

export type GetCommonProps<I extends PixiClass> = {
  children?: JSX.Element;
  as?: C.Instance<I>;
  ref?: (ref: C.Instance<I>) => void;
};

export const CommonPropKeys = ["children", "as"] as const;

export const EventPropKeys: Array<keyof EventProps> = [
  "click",
  "clickcapture",
  "mousedown",
  "mousedowncapture",
  "mouseenter",
  "mouseentercapture",
  "mouseleave",
  "mouseleavecapture",
  "mousemove",
  "mousemovecapture",
  "mouseout",
  "mouseoutcapture",
  "mouseover",
  "mouseovercapture",
  "mouseup",
  "mouseupcapture",
  "mouseupoutside",
  "mouseupoutsidecapture",
  "pointercancel",
  "pointercancelcapture",
  "pointerdown",
  "pointerdowncapture",
  "pointerenter",
  "pointerentercapture",
  "pointerleave",
  "pointerleavecapture",
  "pointermove",
  "pointermovecapture",
  "pointerout",
  "pointeroutcapture",
  "pointerover",
  "pointerovercapture",
  "pointertap",
  "pointertapcapture",
  "pointerup",
  "pointerupcapture",
  "pointerupoutside",
  "pointerupoutsidecapture",
  "rightclick",
  "rightclickcapture",
  "rightdown",
  "rightdowncapture",
  "rightup",
  "rightupcapture",
  "rightupoutside",
  "rightupoutsidecapture",
  "tap",
  "tapcapture",
  "touchcancel",
  "touchcancelcapture",
  "touchend",
  "touchendcapture",
  "touchendoutside",
  "touchendoutsidecapture",
  "touchmove",
  "touchmovecapture",
  "touchstart",
  "touchstartcapture",
  "wheel",
  "wheelcapture",
];

export type ContainerProps = ComponentProps<PixiContainerClass> & {
  added?: (container: Container<ContainerChild>) => void;
  childAdded?: (
    child: Container<ContainerChild>,
    container: Container<ContainerChild>,
    index: number,
  ) => void;
  removed?: (container: Container<ContainerChild>) => void;
  childRemoved?: (
    child: Container<ContainerChild>,
    container: Container<ContainerChild>,
    index: number,
  ) => void;
  destroyed?: () => void;
};
export const ContainerPropKeys = {
  common: CommonPropKeys,
  events: [
    ...EventPropKeys,
    "added",
    "childAdded",
    "removed",
    "childRemoved",
    "destroyed",
  ] as const,
};

export type StageProps = Omit<ContainerProps, "as">;
export const StagePropKeys = {
  common: ["children", "ref"] as const,
  events: ContainerPropKeys.events,
};

export type SpriteProps = ComponentProps<PixiSpriteClass>;
export const SpritePropKeys = {
  common: CommonPropKeys,
  events: EventPropKeys,
};
export type GraphicsProps = ComponentProps<PixiGraphicsClass> & {
  size?: Size;
};
export const GraphicsPropKeys = {
  common: CommonPropKeys,
  events: EventPropKeys,
};

export type ApplicationProps = {
  as?: C.Instance<PixiApplicationClass>;
  ref?: (ref: C.Instance<PixiApplicationClass>) => void;
  children?: JSX.Element;
  fallback?: JSX.Element;
} & Partial<O.Omit<C.Parameters<PixiApplicationClass>[0], "children">>;

export const ApplicationPropKeys = {
  common: [...CommonPropKeys, "fallback", "ref"] as const,
  events: [] as const,
};

// declare module "solid-js" {
//   namespace JSX {
//     interface IntrinsicElements {
//       container: (props: ContainerProps) => JSX.Element;
//       graphics: (props: GraphicsProps) => JSX.Element;
//       sprite: (props: SpriteProps) => JSX.Element;
//     }
//   }
// }
