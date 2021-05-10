import { useState, useContext } from "react"
import { Canvas } from "@react-three/fiber"
import { Plane, Stars } from "@react-three/drei"
import Celestial from "./Celestial"
import CelestialData from "./CelestialData"
import { Location } from "spacetraders-sdk/dist/types"
import { systemsContext } from "../../context/systemsContext"
import { stateContext } from "../../context/stateContext"

import "./styling/SpaceMap.scss"

const SpaceMap = (props: any) => {
  const { systemSelected } = useContext(systemsContext)

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
      loc={loc}
    />
    return __
  })]

  // FUCK https://github.com/pmndrs/react-three-fiber/issues/262
  function ForwardCanvas({ children }: any) {
    const value = useContext(stateContext)
    return (
      <Canvas linear camera={{ position: [0, 0, 200], fov: 100 }}>
        <stateContext.Provider value={value}>
          {children}
        </stateContext.Provider>
      </Canvas>
    )
  }

  return (
    <div 
      className="spacemap-main" 
      style={{zIndex: systemSelected===props.index ? -10 : -100}}
    >
      <div className="spacemap-canvas">
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
  )
}

export default SpaceMap