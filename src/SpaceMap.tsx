import React, { useEffect, useRef, useState } from "react"
import "./css/SpaceMap.css"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from 'three'
import { colors, scale } from "./css/SpaceMap"
import useWindowDimensions from "./hooks/useWindowDimensions"
import { Plane, Line } from "@react-three/drei"

const MapLocation = (props: any) => {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  //useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  // @ts-ignore: i can not be assed to interface and type just for colors
  const _c: any = colors[props.type]
  // @ts-ignore: ditto
  const _s: number = scale[props.type]

  return (
    <mesh 
      {...props}
      ref={mesh} 
      scale={active ? 1.5*_s : _s}
      onClick={(event) => {
        setActive(!active)
        props.clickExtension(event.pageX, event.pageY, [active, setActive])
      }}
      onPointerOver={(event) => {
        setHover(true)
        console.log(props.name)
      }}
      onPointerOut={(event) => setHover(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial attach="material" roughness={0.5} color={_c}  />
    </mesh>
  )
}

const MapLocationData = (props: any) => {
  const [shown, setShown] = useState(false)

  return (
    <div 
      className="SpaceMap_SelectedLocation" 
      key={props.loc.name} 
      id={props.loc.name}
    >
      {String(`[${props.loc.symbol}] ${props.loc.name}`)} <br></br>
      {String(`(${props.loc.x}, ${props.loc.y})`)}
    </div>
  )
}

const SpaceMap = (props: any) => {
  const { height, width } = useWindowDimensions()

  const LocationDataTab = props.system?.locations.map((loc: any) => {
    return (
      <MapLocationData loc={loc}/>
    )
  })

  const Locations = props.system?.locations.map((loc: any) => {
    const x = loc.x
    const y = loc.y
    return (
      <MapLocation 
        key={loc.name} 
        position={[x , y, 0]} 
        name={loc.name} 
        type={loc.type}
        clickExtension={(x: string, y: string, useState: any) => {
          let _: any = document.getElementById(loc.name)
          let [active, setActive] = useState
          //Click either on the 2d, or div to toggle
          setActive(!active)
          _!.onclick = () => {
            console.log('yeet')
            setActive(false) //this doesn't update the state here, so we have to remanually set the rest
            _!.style.zIndex = -10
            _!.style.opacity = 1
          }
          _!.style.transform = `translate(${Number(x)/width * 100}vw, ${Number(y)/height * 100}vh)`
          _!.style.zIndex = active ? -10 : 10
          _!.style.opacity = active ? '0' : '1'
        }}
      />
    )
  })

  return (
    <div>
      <div className="SpaceMap_Canvas">
        <Canvas linear camera={{ position: [0, 0, 200], fov: 100 }}>
          <ambientLight />
          <Plane position={[0, 0, -10]} args={[2000, 2000, 4, 4]}>
            <meshBasicMaterial color="black" />
          </Plane>
          <Line 
            points={[[-1000, 0, -9.9], [1000, 0, -9.9]]}
            color="hsl(0, 100%, 25%)"
          />
          <Line 
            points={[[0, -1000, -9.9], [0, 1000, -9.9]]}
            color="hsl(100, 100%, 10%)"
          />
          {Locations}
        </Canvas>
      </div>
      {LocationDataTab}
    </div>
  )
}

export default SpaceMap