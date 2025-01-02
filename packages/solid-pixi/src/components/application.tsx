import { Application as PixiApplication } from "pixi.js";
import {
  Show,
  Suspense,
  createResource,
  createSignal,
  splitProps,
  untrack,
} from "solid-js";
import { AppContext } from "../context.ts";
import { renderer } from "../jsx-runtime.tsx";
import { ApplicationPropKeys, type ApplicationProps } from "../types.ts";

export const Application = (props: ApplicationProps) => {
  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement | null>(
    null,
  );
  const [common, pixis] = splitProps(props, ApplicationPropKeys.common);

  const [app] = createResource(
    () =>
      canvasRef() && ((common.as || new PixiApplication()) as PixiApplication),
    async (app) => {
      await app.init({
        ...pixis,
        canvas: untrack(canvasRef)!,
      });
      return app;
    },
  );

  renderer.effect(() => {
    if (app()) common.ref?.(app()!);
  });

  return (
    <Suspense fallback={common.fallback}>
      <canvas ref={setCanvasRef} />
      <Show when={app()} fallback={common.fallback}>
        <AppContext.Provider value={app()}>
          {props.children}
        </AppContext.Provider>
      </Show>
    </Suspense>
  );
};

export const SolidApplication = Application;
