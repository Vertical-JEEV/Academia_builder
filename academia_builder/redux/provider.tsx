"use client";

import { makeStore } from "./store";
import { Provider } from "react-redux";

// Props is an interface that defines the type of the props object mainly used in typescript
interface Props {
  children: React.ReactNode;
}

// CustomProvider is a component that wraps the children components with the Provider component from react-redux
export default function CustomProvider({ children }: Props) {
  const store = makeStore();
  return <Provider store={store}>{children}</Provider>;
}
