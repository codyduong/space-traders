import { useState, useContext, useEffect } from "react"
import useWindowDimensions from "../../hooks/useWindowDimensions"
import { celestialContext } from "./celestialContext"
import Draggable from "react-draggable"

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
  
  const style = {
    // transform: `translate(${active?.x/xy.x * 100}vw, ${active?.y/xy.y * 100}vh)`,
    zIndex: active?.active ? 10 : -10,
    opacity: active?.active ? 1 : 0,
  }

  return (
    <Draggable positionOffset={{x: ratio?.x*width, y: ratio?.y*height}}>
      <div
        className="SpaceMap_SelectedLocation"
        id={props.loc.name}
        style={style}
        onClick={()=>{
          //setActive({active: !active.active, x: 0, y: 0})
          //celestialIndexer[props.index].setCelestialActive(false)
        }}
      >
        {String(`[${props.loc.symbol}] ${props.loc.name}`)} <br></br>
        {String(`(${props.loc.x}, ${props.loc.y})`)}
      </div>
    </Draggable>
  )
}

export default CelestialData