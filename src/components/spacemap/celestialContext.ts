import { createContext } from "react";
import { CelestialIndexer } from "./c_types"

// @ts-ignore : fk off
const _: CelestialIndexer[] = []

export const celestialContext = createContext({
  celestialIndexer: _,
  setCelestialIndexer: (f: React.Dispatch<React.SetStateAction<any>>, n: number, s: string) => { },
})