import { createContext, useContext } from "solid-js";
import type { Container, Application as PixiApplication } from "pixi.js";

export const PortalContext = createContext<Container>();
export const usePortal = () => useContext(PortalContext)!;

export const ParentContext = createContext<Container>();

export const useParent = () => useContext(ParentContext)!;

export const AppContext = createContext<PixiApplication>();
export const useApplication = () => useContext(AppContext)!;
