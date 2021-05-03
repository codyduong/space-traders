import { useState, useEffect, useContext } from "react"
import { useSpring, animated } from "react-spring"
import { userCredContext } from "../../context/userCredContext"
import { SpaceTraders } from "spacetraders-sdk"
import { getErrorCode } from "../../scripts/RegExp"

const spaceTraders = new SpaceTraders()

const UserCredentials = () => {
  const {userCred, updateUserCred} = useContext(userCredContext)
  const [user, setUser] = useState<string>(userCred?.username ?? '')
  const [toke, setToke] = useState<string>(userCred?.token ?? '')
  const [showToke, setShowToke] = useState<boolean>(false)
  
  const registerUser = () => {
    spaceTraders.init(user)
      .then(res => {
        console.log(res)
        setToke(res)
        updateUserCred({username: `${user}`, token: `${toke}`})
      })
      .catch(e => {
        console.log(e.message)
        console.log(getErrorCode(e.message))
        if (getErrorCode(e.message)==='409') {
          alert("This user is already registered")
        }
        else throw(e)
      })
  }

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
        defaultValue={shown ? `${userCred?.username} ▲` : `${userCred?.username} ▼`}
        onClick={()=>{setShown(!shown)}}
      ></input>
      <animated.div style={animate}>
        <label htmlFor="user">Username: </label>
        <input
          className="UserCredentials_Text"
          id="user"
          type="text"
          onChange={(event: any)=>{setUser(event.target.value)}}
          placeholder={user}
        ></input><br />
        <label htmlFor="toke">Token: </label>
        <input
          className="UserCredentials_Text"
          id="toke"
          type={showToke ? "password" : "text"}
          onChange={(event: any)=>{setToke(event.target.value)}}
          value={toke}
        ></input>
        <input
          className="UserCredentials_Button"
          id="toke"
          type="button"
          value={showToke ? "Show" : "Hide"}
          onClick={()=>{setShowToke(!showToke)}}
        ></input><br />
        <input
          className="UserCredentials_Button"
          id="submit"
          type="button"
          defaultValue="Submit"
          onClick={()=>{
            updateUserCred({username: `${user}`, token: `${toke}`})
          }}
        ></input>
        <input
          className={toke === "" ? "UserCredentials_Button" : "UserCredentials_Button tooltip"}
          id="submit"
          type="button"
          defaultValue="Register User"
          disabled={toke === "" ? (user !== "" ? false : true) : true}
          title={user !== "" ? (toke === "" ? '' : 'Token field must be null') : 'Username cannot be null'}
          onClick={()=>{
            registerUser()
          }}
        ></input>
      </animated.div>
    </div>
  )
}

export default UserCredentials