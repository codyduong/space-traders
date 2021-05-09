import { useState, useEffect } from "react"
import { userContext } from "../../context/userContext"
import { animated, useSpring } from "react-spring"
import "./css/Money.css"

const Money = () => {

  const [shown, setShown] = useState<boolean>(false)
  const [init, setInit] = useState<boolean>(false)
  useEffect(()=>{
    setInit(true)
  }, [])
  const animate = useSpring({
    zIndex: 10,
    opacity: init ? 1 : 0,
    reset: false,
    delay: 0,
    reverse: !shown,
    overflow: 'hidden',
    maxWidth: init ? '30em' : '0em',
    maxHeight: init ? '30em' : '0em',
    from: { maxWidth: !init ? '30em' : '0em', maxHeight: !init ? '30em' : '0em'},
  })

  return (
    <userContext.Consumer>
      {({ user }) => (
        <div className="money-main">
          <div 
            className="money-credits"
            onClick={()=>{
              setShown(!shown)
            }}
          >
            Credits: {user?.credits}
          </div>
          <animated.div style={animate}>
            words
          </animated.div>
        </div>
      )}
    </userContext.Consumer>
  )
}

export default Money