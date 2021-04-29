import { createContext } from "react"

const _: Record<string, Record<string, React.Dispatch<React.SetStateAction<any>>>> = {}

export const stateContext = createContext({
  state: _,
  set: (name: string, functionName: string , f: React.Dispatch<React.SetStateAction<any>>) => {},
})