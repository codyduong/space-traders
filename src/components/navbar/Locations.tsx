import { useState, useEffect, useContext } from "react"
import { animated, useSpring } from "react-spring"
import { Location } from "spacetraders-sdk/dist/types"
import { stateContext } from "../../context/stateContext"
import { systemsContext } from "../../context/systemsContext"
import { position } from "../../types"

import "./styling/Locations.scss"

const Loc = (props: any) => {
  const [active, setActive] = useState<boolean>(false)

  const { state, set } = useContext(stateContext)
  useEffect(() => {
    set(props.location.symbol, 'setLocationActive', setActive)
  }, [])

  return (
    <div key={props.location.symbol}>
      {props.location.name}
      <input
        style={{float: 'right'}}
        type="button"
        value="Select"
        onClick={(event)=>{
          state[props.location.symbol]['setCelestialActive'](!active)
          state[props.location.symbol]['setCelestialDataActive'](!active)
          state[props.location.symbol]['setCelestialDataPosition']({x: event.pageX + 30, y: event.pageY} as position)
          setActive(!active)
        }}
      ></input>
    </div>
  )
}

const Locations = (props: any) => {
  const { systems, systemSelected } = useContext(systemsContext)
  const [shown, setShown] = useState(false)

  const [init, setInit] = useState(false)
  useEffect(()=>{
    setInit(true)
  }, [])
  const animate = useSpring({
    opacity: init ? 1 : 0,
    reset: false,
    delay: 0,
    reverse: !shown,
    overflow: 'hidden',
    maxWidth: init ? '30em' : '0em',
    maxHeight: init ? '30em' : '0em',
    from: { maxWidth: !init ? '30em' : '0em', maxHeight: !init ? '30em' : '0em'},
  })

  const locations = systems?.systems[systemSelected]?.locations.map((location: Location) => {
    return <Loc location={location}/>
  })

  return (
    <div className="Locations_Main">
      <input
        type="button"
        onClick={() => {  
          setShown(!shown)
        }}
        value={shown ? "Locations ▲" : "Locations ▼"}
      ></input>
      <animated.div style={animate}>
        {locations}
      </animated.div>
    </div>
  )
}

export default Locations