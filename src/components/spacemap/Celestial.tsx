import { useState, useRef, useContext, useEffect } from "react"
import { colors, scale } from "./css/SpaceMap"
import * as THREE from 'three'
import { celestialContext } from "./celestialContext"

const Celestial = (props: any) => {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)

  const { celestialIndexer, setCelestialIndexer } = useContext(celestialContext)

  //So we only set this once, rather than upon each rerender
  useEffect(() => {
    setCelestialIndexer(setActive, props.index, "setCelestialActive")
  }, [])

  //useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  // @ts-ignore: i can not be assed to interface and type just for colors
  const _c: any = colors[props.type]
  // @ts-ignore: ditto
  const _s: number = scale[props.type]

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 * _s : _s}
      onClick={(event) => {
        setActive(!active)
        celestialIndexer[props.index].setCelestialDataActive(true)
      }}
      onPointerOver={(event) => {
        setHover(true)
      }}
      onPointerOut={(event) => setHover(false)}
    >
      {props.type === "WORMHOLE"} ? <></> : <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial attach="material" roughness={0.5} color={_c} />
    </mesh>
  )
}

export default Celestial