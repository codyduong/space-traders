import { useState, useEffect, useContext } from "react"
import { useSpring, animated } from "react-spring"
import { userCredContext } from "./context/userCredContext"

const UserCredentials = () => {
  const {userCred, updateUserCred} = useContext(userCredContext)
  const [user, setUser] = useState<string>(userCred?.username ?? '')
  const [toke, setToke] = useState<string>(userCred?.token ?? '')
  
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

  return (
    <div>
      <input 
        type="button"
        defaultValue={shown ? `${user} ▲` : `${user} ▼`}
        onClick={()=>{setShown(!shown)}}
      ></input>
      <animated.div style={animate}>
        <label htmlFor="user">Username: </label>
        <input
          className="UserCredentials_Text"
          id="user"
          type="text"
          onChange={(event: any)=>{setUser(event.target.value)}}
        ></input>
        <label htmlFor="toke">Token: </label>
        <input
          className="UserCredentials_Text"
          id="toke"
          type="text"
          onChange={(event: any)=>{
            setToke(event.target.value)
          }}
        ></input>
        <label htmlFor="submit"></label>
        <input
          className="UserCredentials_Button"
          id="submit"
          type="button"
          defaultValue="Submit"
          onClick={()=>{
            updateUserCred({username: `${user}`, token: `${toke}`})
          }}
        ></input>
      </animated.div>
    </div>
  )
}

export default UserCredentials