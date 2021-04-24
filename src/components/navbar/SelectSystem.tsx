import { useState, useContext, useEffect} from "react"
import { systemsContext } from "../../context/systemsContext"
import { animated, useSpring } from "react-spring"

const SelectSystem = () => {
  const { systems, systemSelected, selectSystem } = useContext(systemsContext)
  
  const [shown, setShown]  = useState<boolean>(false)
  const [init, setInit] = useState<boolean>(false)
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

  const systemsList = systems?.systems?.map((system: any, index: number) => {
    return (
      <input
        key={system.name}
        className="SelectSystem_Button"
        type="Button"
        defaultValue={system.name}
        onClick={() => {
          selectSystem(index)
        }}
      ></input>
    )
  })
  
  return (
    <div>
    <input
      className="SelectSystem_Button"
      type="Button"
      defaultValue={shown ? `Select System ▲: ${systems?.systems[systemSelected]?.name}` : `Select System ▼: ${systems?.systems[systemSelected]?.name}`}
      onClick={() => {
        setShown(!shown)
      }}
    ></input>
      <animated.div style={animate}>
        {systemsList}
      </animated.div>
    </div>
  )
}

export default SelectSystem