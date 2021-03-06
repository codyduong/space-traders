import { useState, useEffect } from "react"
import { userContext } from "./context/userContext"
import { systemsContext } from "./context/systemsContext"
import { userCredContext } from "./context/userCredContext"
import SystemsManager from "./components/spacemap/SystemsManager"
import NavBar from "./components/navbar/NavBar"
import Money from "./components/money/Money"
import { useCookies } from "react-cookie"
import { useLocalStorage, useSessionStorage } from "./hooks/storageHooks"
import { User, SystemsResponse, AccountResponse } from "spacetraders-sdk/dist/types"
import { UserCred } from "./types"
import { SpaceTraders } from "spacetraders-sdk"
import { AuthenticationError } from "spacetraders-sdk/dist/errors"
import { stateContext } from "./context/stateContext"

import "./styling/Main.scss"

const spaceTraders = new SpaceTraders()

const Main = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['session'])
  const session = cookies.session ?? null

  const [userCred, setUserCred] = useLocalStorage<UserCred>('user')
  const [userError, setUserError] = useState<boolean>(false)
  try {
    userCred.username && spaceTraders.init(userCred.username, userCred.token)
  } catch (e) {
    //alert(e)
    if (e instanceof AuthenticationError) {

    }
  }

  const [user, setUser] = useSessionStorage<User>('user')
  const updateUser = () => {
    userCred && spaceTraders.getAccount()
      .then((res: AccountResponse) => {
        console.log(res.user)
        setUser(res.user)
      })
  }

  const [systems, setSystems] = useSessionStorage<SystemsResponse>('systems')
  const [systemSelected, selectSystem] = useSessionStorage<number>('systemSelected')
  const updateSystems = (systems: any) => {
    
  } 

  useEffect(() => {
    if (userCred) {
      if (user===null || session===null) {
        spaceTraders.getAccount().then((res: AccountResponse) => {
          console.log(res)
          setUser(res.user)
        })
      }
    }
    if (session===null) {
      setCookie('session', '', { path: '/ ', maxAge: 900})
      setInterval(() => {setCookie('session', null, { path: '/ ', maxAge: -1})}, 900000)
    }
    if (systemSelected===null) {
      selectSystem(0)
    }
  }, [userCred, systems, user, session])

  const [stateCurrent, setStateCurrent] = useState<Record<string, Record<string, any>>>({})
  //I pray I never have to attempt to understand the context happening here.
  const sSC = (name: string, functionName: string , value: any) => {
    let _: Record<string, Record<string, any>> = stateCurrent
    _[name] = stateCurrent[name] ?? {}
    _[name][functionName] = value
    setStateCurrent(_)
  }

  return (
    <userCredContext.Provider value={{userCred: userCred, updateUserCred: setUserCred}}>
    <userContext.Provider value={{user: user, updateUser: updateUser}}>
    <systemsContext.Provider value={{systems: systems, updateSystems: updateSystems, systemSelected: systemSelected, selectSystem: selectSystem}}>
    <stateContext.Provider value={{state: stateCurrent, set: sSC}}>
    <div className="main">
      <SystemsManager />
      <div className="main-grid">
        <NavBar />
        <Money />
      </div>
    </div>
    </stateContext.Provider>
    </systemsContext.Provider>
    </userContext.Provider>
    </userCredContext.Provider>
  )
}

export default Main