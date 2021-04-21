import { useState, useEffect } from "react"
import "./css/Main.css"
// import { settingsDefault, settingsContext } from "./context/settingsContext"
// import settingsInterface from "./interfaces/settings"
import { userContext } from "./context/userContext"
import { systemsContext, SystemsResponse } from "./context/systemsContext"
import { userCredContext } from "./context/userCredContext"
// import systemsInterface from "./interfaces/systems"
import SpaceMap from "./SpaceMap"
import NavBar from "./NavBar"
import Money from "./Money"
import { useCookies } from "react-cookie"
import { useLocalStorage, useSessionStorage } from "./hooks/storageHooks"
import { System, User } from "spacetraders-sdk/dist/types"
import { UserCred } from "./types"
import SpaceTradersExtend from "./spacetraders/spacetraders"
import { AuthenticationError } from "spacetraders-sdk/dist/errors"

const token = require('./token.json')
const spaceTraders = new SpaceTradersExtend()
//spaceTraders.init('duongc', `${token.token}`)

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
    userCred.username && spaceTraders.getAccount()
      .then(res => {
        console.log(res.user)
        setUser(res.user)
      })
  }

  const [systems, setSystems] = useSessionStorage<SystemsResponse>('systems')
  const updateSystems = (systems: any) => {
    userCred.username && spaceTraders.listSystemsFixed()
      .then(res => {
        console.log(res)
        setSystems(res)
        selectSystem(res.systems[0]) //The default system is the first selected one.
      })
  } 

  const [systemSelected, selectSystem] = useSessionStorage<System>('systemSelected')

  useEffect(() => {
    if (userCred!==null) {
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
            let _: any = res //A dumb workaround for bad typing on the sdk side
            console.log(_.systems[0])
            setSystems(_)
            selectSystem(_.systems[0]) //The default system is the first selected one.
          })
      }
    }
    if (session===null) {
      setCookie('session', '', { path: '/ ', maxAge: 900})
    }
  }, [])

  return (
    <userCredContext.Provider value={{userCred: userCred, updateUserCred: setUserCred}}>
    <userContext.Provider value={{user: user, updateUser: updateUser}}>
    <systemsContext.Provider value={{systems: systems, updateSystems: updateSystems, systemSelected: systemSelected, selectSystem: selectSystem}}>
    <div className="Main">
      <SpaceMap system={systemSelected} />
      <div className="Main_Margin">
        <div className="Main_ResponsiveGrid">
          <NavBar />
          <Money />
        </div>
      </div>
    </div>
    </systemsContext.Provider>
    </userContext.Provider>
    </userCredContext.Provider>
  )
}

export default Main