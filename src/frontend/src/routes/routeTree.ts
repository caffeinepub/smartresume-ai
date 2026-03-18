import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { lazy } from "react";
import RootLayout from "../components/layout/RootLayout";

// Lazy load pages
const LandingPage = lazy(() => import("../pages/LandingPage"));
const BuilderPage = lazy(() => import("../pages/BuilderPage"));

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

export const builderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder",
  component: BuilderPage,
});

export const routeTree = rootRoute.addChildren([indexRoute, builderRoute]);

export { createRouter };
