import { createContext } from "react"; 
import systemsInterface from "../interfaces/systems"

export const systemsDefault: systemsInterface = {
  
}

export const systemsContext = createContext({
  systems: systemsDefault,
  updateSystems: (props: any) => {},
})