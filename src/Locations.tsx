import { useState, useEffect } from "react"
import { animated, useSpring } from "react-spring"
import "./css/Locations.css"

const Locations = (props: any) => {
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
    overflow: 'auto',
    maxWidth: init ? '30em' : '0em',
    maxHeight: init ? '30em' : '0em',
    from: { maxWidth: !init ? '30em' : '0em', maxHeight: !init ? '30em' : '0em'},
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
        <div>
          your mom
        </div>
      </animated.div>
    </div>
  )
}

export default Locations