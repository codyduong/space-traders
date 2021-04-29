import { useState, useEffect, useContext } from "react"
import { animated, useSpring } from "react-spring"
import { Location } from "spacetraders-sdk/dist/types"
import { stateContext } from "../../context/stateContext"
import { systemsContext } from "../../context/systemsContext"
import "./css/Locations.css"

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

  const { state } = useContext(stateContext)

  const locations = systems?.systems[systemSelected]?.locations.map((location: Location, index: number) => {
    return (
      <div key={location.symbol}>
        {location.name}
        <input
          type="button"
          value="Select"
          onClick={()=>{
            state[location.symbol]['setDataActive'](true)
          }}
        ></input>
      </div>
    )
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