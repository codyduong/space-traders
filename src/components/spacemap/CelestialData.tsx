import { useState, useContext, useEffect } from "react"
import { celestialContext } from "./celestialContext"

const CelestialData = (props: any) => {
  const [active, setActive] = useState<boolean>(false)
  useEffect(() => {
    if (active===true) alert('pog')
  }, [active])

  const { setCelestialIndexer } = useContext(celestialContext)

  //So we only set this once, rather than upon each rerender
  useEffect(() => {
    setCelestialIndexer(setActive, props.index, "setCelestialDataActive")
  }, [])

  return (
    <div
      className="SpaceMap_SelectedLocation"
      id={props.loc.name}
    >
      {String(`[${props.loc.symbol}] ${props.loc.name}`)} <br></br>
      {String(`(${props.loc.x}, ${props.loc.y})`)}
    </div>
  )
}

export default CelestialData