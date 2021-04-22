import { useState, useContext } from "react"
import "./css/SpaceMap.css"
import { Canvas } from "@react-three/fiber"
import { Plane, Stars } from "@react-three/drei"
import Celestial from "./Celestial"
import CelestialData, { dataActiveState } from "./CelestialData"
import { celestialContext } from "./celestialContext"
import { Location } from "spacetraders-sdk/dist/types"
import { CelestialIndexer } from "./c_types"

const SpaceMap = (props: any) => {
  const [celestialIndexer, setCelestialIndexer] = useState<CelestialIndexer[]>([])
  //I pray I never have to attempt to understand the context happening here.
  const sCI = (f: React.Dispatch<React.SetStateAction<any>>, n: number, s: string) => {
    let _: any[] = celestialIndexer
    let f1: React.Dispatch<React.SetStateAction<boolean>> = _[n]?.setCelestialActive!
    let f2: React.Dispatch<React.SetStateAction<dataActiveState>> = _[n]?.setCelestialDataActive!
    //console.log(s, s==="setCelestialActive", s==="setCelestialDataActive", n)
    if (s==="setCelestialActive") {f1=f} 
    else if (s==="setCelestialDataActive") {f2=f}
    let __: CelestialIndexer = {setCelestialActive: f1, setCelestialDataActive: f2}
    _[n] = __
    setCelestialIndexer(_)
    //console.log(celestialIndexer)
  }

  const [CelestialDatas, Celestials] = [props.system?.locations?.map((loc: Location, index: number) => {
    const __ = <CelestialData 
      key={`${loc.symbol}_DATA`} 
      index={index}
      loc={loc}
    />
    return __
  }), props.system?.locations?.map((loc: Location, index: number) => {
    const __ = <Celestial 
      key={loc.symbol}
      index={index}
      position={[loc.x, loc.y, 0]}
      name={loc.name}
      type={loc.type}
    />
    return __
  })]

  // FUCK https://github.com/pmndrs/react-three-fiber/issues/262
  // @ts-ignore : we just gonna do this.
  function ForwardCanvas({ children }) {
    const value = useContext(celestialContext)
    return (
      <Canvas linear camera={{ position: [0, 0, 200], fov: 100 }}>
        <celestialContext.Provider value={value}>
          {children}
        </celestialContext.Provider>
      </Canvas>
    )
  }

  return (
    <celestialContext.Provider value={{celestialIndexer: celestialIndexer, setCelestialIndexer: sCI}}> 
    <div>
      <div className="SpaceMap_Canvas">
        <ForwardCanvas>
          <ambientLight />
          <Plane position={[0, 0, -300]} args={[3000, 3000, 4, 4]}>
            <meshBasicMaterial color="black" />
          </Plane>
          <Stars 
            radius={100}
            factor={1}
            count={300}
          />
          {Celestials}
        </ForwardCanvas>
      </div>
      {CelestialDatas}
    </div>
    </celestialContext.Provider>
  )
}

export default SpaceMap