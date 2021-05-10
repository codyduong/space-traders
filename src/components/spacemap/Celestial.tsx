import { useState, useRef, useContext, useEffect } from "react"
import { colors, scale } from "./styling/SpaceMap"
import * as THREE from 'three'
import Wormhole from "./Wormhole"
import { stateContext } from "../../context/stateContext"
import { position } from "../../types"

const Celestial = (props: any) => {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)

  const { state, set } = useContext(stateContext)

  const setCelestialActive: any = (value: boolean | null) => {if (value===null) {return active} else {setActive(value); return null}}

  //So we only set this once, rather than upon each rerender
  useEffect(() => {
    set(props.loc.symbol, "setCelestialActive", setCelestialActive)
  }, [])

  //useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  // @ts-ignore: i can not be assed to interface and type just for colors
  const _c: any = colors[props.type] ?? "rgb(255,255,255)"
  // @ts-ignore: ditto
  const _s: number = scale[props.type] ?? 1

  return false ? ( //props.type==="WORMHOLE"
    <Wormhole position={props.position} />
  ) : (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 * _s : _s}
      onClick={(event) => {
        state[props.loc.symbol]['setLocationActive'](!active)
        state[props.loc.symbol]['setCelestialActive'](!active)
        state[props.loc.symbol]['setCelestialDataActive'](!active)
        state[props.loc.symbol]['setCelestialDataPosition']({x: event.pageX, y: event.pageY} as position)
        setActive(!active)
      }}
      onPointerOver={(event) => {
        setHover(true)
      }}
      onPointerOut={(event) => setHover(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial attach="material" roughness={0.5} color={_c} />
    </mesh>
  )
}

export default Celestial