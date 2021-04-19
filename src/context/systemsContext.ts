import { createContext } from "react"; 
import systemsInterface from "../interfaces/systems"
import systemInterface from "../interfaces/system"

export const systemsDefault: systemsInterface = {
  systems: [],
}

export const systemSelectedDefault: systemInterface = {
  name: "",
  locations: [],
}

export const systemsContext = createContext({
  systems: systemsDefault,
  systemSelected: systemSelectedDefault,
  updateSystems: (props: any) => {},
  selectSystem: (props: any) => {},
})