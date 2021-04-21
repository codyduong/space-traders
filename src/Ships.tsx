import { useContext, useState, useEffect } from "react"
import { userContext } from "./context/userContext"
import { animated, useSpring } from "react-spring"
import "./css/Ships.css"

const Ships = (props: any) => {
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

  const {user} = useContext(userContext)
  const ships = user?.ships?.map((ship: any) => {
    return (
      <div className="Ships_Singular" key={ship.id}>
        ID: {ship.id}<br/>
        Type: {ship.type}<br/>
        Location: {ship.location}<br/>
        {/* X: {ship.x}
        Y: {ship.y} */}
        {/* Cargo: {ship.cargo} */}
        Cargo: {ship.maxCargo - ship.spaceAvailable} / {ship.maxCargo}<br/>
        {/* Class: {ship.class}<br/> */}
        Speed: {ship.speed}<br/>
        Plating: {ship.plating}<br/>
        Weapons: {ship.weapons}<br/>
        {/* Manufacturer: {ship.manufacturer}<br/> */}
      </div>
    )
  })

  return (
    <div className="Ships_Main">
      <input
        className="Ships_Button"
        type="button"
        onClick={() => { 
          setShown(!shown)
        }}
        value={shown ? "Ships ▲" : "Ships ▼"}
      ></input>
      <animated.div style={animate}>
        <div className="Ships_Grid">
          {ships}
        </div>
      </animated.div>
    </div>
  )
}

export default Ships