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

  const [shown, setShown] = useState<boolean>(false)
  const animate = useSpring({
    opacity: 1,
    reset: false,
    delay: 0,
    reverse: !shown,
    overflow: 'hidden',
    maxWidth: '0em',
    maxHeight: '0em',
    from: { maxWidth: '30em', maxHeight: '30em'},
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
        onClick={() => {
          //setActive({active: !active.active, x: 0, y: 0})
          //celestialIndexer[props.index].setCelestialActive(false)
        }}
      >
        <span>
          <div className="SpaceMap_Tab">
            <div className="SpaceMap_Name">
              {String(`[${props.loc.symbol}] ${props.loc.name}`)}
            </div>
            <div className="SpaceMap_NavBar">
              <div className="SpaceMap_Mini">
                {shown ? '-' : '☐'}
              </div>
              <div className="SpaceMap_Quit">
                X
              </div>
            </div>
          </div>
        </span>
        {String(`(${props.loc.x}, ${props.loc.y})`)}
      </div>
    </Draggable>
  )
}

export default CelestialData