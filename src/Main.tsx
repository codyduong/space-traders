import { useState, useEffect } from "react"
import "./css/Main.css"
// import { settingsDefault, settingsContext } from "./context/settingsContext"
// import settingsInterface from "./interfaces/settings"
import { userContext } from "./context/userContext"
import { systemsContext } from "./context/systemsContext"
import { userCredContext } from "./context/userCredContext"
// import systemsInterface from "./interfaces/systems"
import SystemsManager from "./components/spacemap/SystemsManager"
import NavBar from "./components/navbar/NavBar"
import Money from "./components/money/Money"
import { useCookies } from "react-cookie"
import { useLocalStorage, useSessionStorage } from "./hooks/storageHooks"
import { System, User, SystemsResponse } from "spacetraders-sdk/dist/types"
import { UserCred } from "./types"
//import SpaceTradersExtend, { SystemsResponse } from "./spacetraders/spacetraders"
import { SpaceTraders } from "spacetraders-sdk"
import { AuthenticationError } from "spacetraders-sdk/dist/errors"

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
  const updateUser = (user: User) => {
    userCred && spaceTraders.getAccount()
      .then(res => {
        console.log(res.user)
        setUser(res.user)
      })
  }

  const [systems, setSystems] = useSessionStorage<SystemsResponse>('systems')
  const updateSystems = (systems: any) => {
    userCred && spaceTraders.listSystems()
      .then(res => {
        console.log(res)
        setSystems(res)
      })
  } 

  const [systemSelected, selectSystem] = useSessionStorage<number>('systemSelected')

  useEffect(() => {
    if (userCred) {
      if (user===null || session===null) {
        spaceTraders.getAccount()
          .then(res => {
            console.log(res)
            setUser(res.user)
          })
      }
      if (systems===null || session===null) {
        spaceTraders.listSystems()
          .then(res => {
            console.log(res)
            setSystems(res)
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

  return (
    <userCredContext.Provider value={{userCred: userCred, updateUserCred: setUserCred}}>
    <userContext.Provider value={{user: user, updateUser: updateUser}}>
    <systemsContext.Provider value={{systems: systems, updateSystems: updateSystems, systemSelected: systemSelected, selectSystem: selectSystem}}>
    <div className="Main">
      <SystemsManager />
      <div className="Main_ResponsiveGrid">
        <NavBar />
        <Money />
      </div>
    </div>
    </systemsContext.Provider>
    </userContext.Provider>
    </userCredContext.Provider>
  )
}

export default Main