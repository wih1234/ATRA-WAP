import { useCallback, useEffect, useState } from "react";

export type RouteName =
  | "dashboard"
  | "customers"
  | "customer"
  | "orders"
  | "tasks"
  | "assistant";

export type Route = { name: RouteName; customerId?: string };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, "");
  const parts = clean.split("/").filter(Boolean);
  const [head, second] = parts;
  if (!head) return { name: "dashboard" };
  if (head === "customers") {
    if (second) return { name: "customer", customerId: decodeURIComponent(second) };
    return { name: "customers" };
  }
  if (head === "orders") return { name: "orders" };
  if (head === "tasks") return { name: "tasks" };
  if (head === "assistant") return { name: "assistant" };
  return { name: "dashboard" };
}

export function toHash(route: Route): string {
  switch (route.name) {
    case "dashboard":
      return "#/";
    case "customers":
      return "#/customers";
    case "customer":
      return `#/customers/${encodeURIComponent(route.customerId ?? "")}`;
    case "orders":
      return "#/orders";
    case "tasks":
      return "#/tasks";
    case "assistant":
      return "#/assistant";
  }
}

function readRoute(): Route {
  return parseHash(window.location.hash);
}

export function useHashRoute(): { route: Route; navigate: (route: Route) => void } {
  const [route, setRoute] = useState<Route>(() =>
    typeof window !== "undefined" ? readRoute() : { name: "dashboard" },
  );
  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const navigate = useCallback((next: Route) => {
    const target = toHash(next);
    if (window.location.hash !== target) {
      window.location.hash = target;
    } else {
      setRoute(next);
    }
  }, []);
  return { route, navigate };
}
