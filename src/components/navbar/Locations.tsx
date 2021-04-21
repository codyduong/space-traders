import { useState, useEffect, useContext } from "react"
import { animated, useSpring } from "react-spring"
import { systemsContext } from "../../context/systemsContext"
import "./css/Locations.css"

const Locations = (props: any) => {
  const { systemSelected } = useContext(systemsContext)
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

  const locations = systemSelected?.locations?.map((location: any) => {
    return (
      <div key={location.symbol}>
        {location.name}
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