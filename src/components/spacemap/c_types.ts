import { dataActiveState } from "./CelestialData";

export interface CelestialIndexer {
  setCelestialActive: React.Dispatch<React.SetStateAction<boolean>>,
  setCelestialDataActive: React.Dispatch<React.SetStateAction<dataActiveState>>,
}