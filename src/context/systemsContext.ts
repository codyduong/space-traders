import { createContext } from "react"; 
import { SystemsResponse, System } from "spacetraders-sdk/dist/types";

export const systemsDefault: SystemsResponse = {
  systems: []
}

export const systemSelectedDefault: number = 0

export const systemsContext = createContext({
  systems: systemsDefault,
  systemSelected: systemSelectedDefault,
  updateSystems: (props: any) => {},
  selectSystem: (props: any) => {},
})