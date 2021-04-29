import { createContext } from "react"

const _: Record<string, Record<string, any>> = {}

export const stateContext = createContext({
  state: _,
  set: (name: string, functionName: string , value: any) => {},
})