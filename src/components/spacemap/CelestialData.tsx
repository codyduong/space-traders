import { useState, useContext, useEffect, useRef } from "react"
import useWindowDimensions from "../../hooks/useWindowDimensions"
import Draggable from "react-draggable"
import { animated, useSpring } from "react-spring"
import "./css/CelestialData.css"
import { stateContext } from "../../context/stateContext"
import { position } from "../../types"
import DownArrow from "./chevron-bar-down.svg"
import UpArrow from "./chevron-bar-up.svg"

const CelestialData = (props: any) => {
  const [active, setActive] = useState<boolean>(false)
  const [position, setPosition] = useState<position>({x: 0, y: 0})
  const [shown, setShown] = useState<boolean>(false)
  const { height, width } = useWindowDimensions()

  const onControlledDrag = (e: any, position: position) => {const {x, y} = position; setPosition({x, y});};

  const setCelestialDataActive: any = (value: boolean | null) => {if (value===null) {return active} else {setActive(value); return null}}
  const setCelestialDataPosition: any = (value: position | null) => {if (value===null) {return position} else {setPosition(value); return null}}
  const { state, set } = useContext(stateContext)
  useEffect(() => {
    set(props.loc.symbol, "setCelestialDataActive", setCelestialDataActive)
    set(props.loc.symbol, "setCelestialDataPosition", setCelestialDataPosition)
  }, [])

  const animate = useSpring({
    opacity: 1,
    reset: false,
    delay: 0,
    reverse: shown,
    overflow: 'hidden',
    maxHeight: '0em',
    from: { maxHeight: '30em'},
  })
  
  const style = {
    zIndex: active ? 10 : -20,
    opacity: active ? 1 : 0,
  }

  const ref = useRef<HTMLDivElement>(null!)
  return (
    <Draggable 
      position={position} 
      onDrag={onControlledDrag}
      handle="span"
      bounds={{
        top: 0,
        right: width - ref?.current?.offsetWidth,
        bottom: height - ref?.current?.offsetHeight,
        left: 0,
      }}
    >
      <div
        ref={ref}
        className="CelestialData_Main"
        id={props.loc.name}
        style={style}
      >
        <div className="CelestialData_Tab">
          <span>
            <div
              className="CelestialData_Name"
            >
              {String(`[${props.loc.symbol}] ${props.loc.name}`)}
            </div>
          </span>
          <div className="CelestialData_NavBar">
            <div
              className="CelestialData_Mini"
              onClick={() => {
                setShown(!shown)
              }}
            >
              {shown ? <img src={UpArrow} alt="▲"></img> : <img src={DownArrow} alt="▼"></img>}
            </div>
            <div
              className="CelestialData_Quit"
              onClick={() => {
                state[props.loc.symbol]['setLocationActive'](false)
                state[props.loc.symbol]['setCelestialActive'](false)
                setActive(false)
              }}
            >
              X
              </div>
          </div>
        </div>
        <animated.div style={animate}>
          <div className="CelestialData_Data">
            <div className="CelestialData_Coordinates">{String(`${props.loc.x}, ${props.loc.y}`)}</div>
            <div className="CelestialData_Construction">{String(`Build: ${props.loc.allowsConstruction}`)}</div>
          </div>
        </animated.div>
      </div>
    </Draggable>
  )
}

export default CelestialData