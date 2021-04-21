import { createContext } from "react"; 
import { System } from "spacetraders-sdk/dist/types";

//It seems SystemsResponse from spacetraders is wrong, so here is mine
import { SystemsResponse } from "../spacetraders/spacetraders"

export const systemsDefault: SystemsResponse = {
  systems: []
}

export const systemSelectedDefault: System = {
  name: "",
  symbol: "",
  locations: [],
}

export const systemsContext = createContext({
  systems: systemsDefault,
  systemSelected: systemSelectedDefault,
  updateSystems: (props: any) => {},
  selectSystem: (props: any) => {},
})