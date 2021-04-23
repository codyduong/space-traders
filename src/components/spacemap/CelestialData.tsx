import { useState, useContext, useEffect, useRef } from "react"
import useWindowDimensions from "../../hooks/useWindowDimensions"
import { celestialContext } from "./celestialContext"
import Draggable from "react-draggable"
import { animated, useSpring } from "react-spring"

export interface dataActiveState {
  active: boolean,
  x: number,
  y: number,
}

interface ratios {
  x: number,
  y: number,
}

const CelestialData = (props: any) => {
  const [active, setActive] = useState<dataActiveState>({active: false, x: 0, y: 0})
  const [shown, setShown] = useState<boolean>(false)
  const [hoverQuit, setHoverQuit] = useState<boolean>(false)
  const [hoverMove, setHoverMove] = useState<boolean>(false)
  const [ratio, setRatios] = useState<ratios>({x: 0, y: 0})
  const { height, width } = useWindowDimensions()

  useEffect(() => {
    if (active?.active===true) {
      setRatios({x: active?.x/width, y: active?.y/height})
    }
  }, [active])

  const { celestialIndexer, setCelestialIndexer } = useContext(celestialContext)

  //So we only set this once, rather than upon each rerender
  useEffect(() => {
    setCelestialIndexer(setActive, props.index, "setCelestialDataActive")
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
    // transform: `translate(${active?.x/xy.x * 100}vw, ${active?.y/xy.y * 100}vh)`,
    zIndex: active?.active ? 10 : -10,
    opacity: active?.active ? 1 : 0,
  }

  const ref = useRef<HTMLDivElement>(null!)
  return (
    <Draggable 
      positionOffset={{x: ratio?.x*width, y: ratio?.y*height}} 
      handle="span"
      bounds={{
        top: - ratio?.y*height, 
        right: width - ratio?.x*width - ref?.current?.offsetWidth,
        bottom: height - ratio?.y*height - ref?.current?.offsetHeight, 
        left: - ratio?.x*width}}
    >
      <div
        ref={ref}
        className="SpaceMap_SelectedLocation"
        id={props.loc.name}
        style={style}
      >
        <div className="SpaceMap_Tab">
          <span>
            <div
              className="SpaceMap_Name"
              style={{ cursor: hoverMove ? 'move' : 'auto' }}
              onMouseOver={() => { setHoverMove(!hoverMove) }}
              onMouseOut={() => { setHoverMove(!hoverMove) }}
            >
              {String(`[${props.loc.symbol}] ${props.loc.name}`)}
            </div>
          </span>
          <div className="SpaceMap_NavBar">
            <div
              className="SpaceMap_Mini"
              onClick={() => {
                setShown(!shown)
              }}
            >
              {shown ? '-' : '☐'}
            </div>
            <div
              className="SpaceMap_Quit"
              style={{ backgroundColor: hoverQuit ? 'hsl(0, 100%, 75%)' : '' }}
              onMouseOver={() => { setHoverQuit(!hoverQuit) }}
              onMouseOut={() => { setHoverQuit(!hoverQuit) }}
              onClick={() => {
                setActive({ active: !active.active, x: 0, y: 0 })
                celestialIndexer[props.index].setCelestialActive(false)
              }}
            >
              X
              </div>
          </div>
        </div>
        <animated.div style={animate}>
          {String(`Coordinates: (X: ${props.loc.x}, Y: ${props.loc.y})`)}
        </animated.div>
      </div>
    </Draggable>
  )
}

export default CelestialData