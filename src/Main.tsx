import { useState, useEffect } from "react"
import "./css/Main.css"
// import { settingsDefault, settingsContext } from "./context/settingsContext"
// import settingsInterface from "./interfaces/settings"
import { userDefault, userContext } from "./context/userContext"
import { systemsDefault, systemsContext, SystemsResponse } from "./context/systemsContext"
// import systemsInterface from "./interfaces/systems"
import SpaceMap from "./SpaceMap"
import NavBar from "./NavBar"
import Money from "./Money"
import { useCookies } from "react-cookie"
import { useLocalStorage, useSessionStorage } from "./hooks/storageHooks"
import { System, User } from "spacetraders-sdk/dist/types"
import SpaceTradersExtend from "./spacetraders/spacetraders"

const token = require('./token.json')
const spaceTraders = new SpaceTradersExtend()
spaceTraders.init('duongc', `${token.token}`)

const Main = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['session'])
  const session = cookies.session ?? null

  const [user, setUser] = useLocalStorage<User>('user')
  const updateUser = (user: User) => {
    spaceTraders.getAccount()
      .then(res => {
        console.log(res.user)
        setUser(res.user)
      })
  }

  const [systems, setSystems] = useSessionStorage<SystemsResponse>('systems')
  const updateSystems = (systems: any) => {
    spaceTraders.listSystemsFixed()
      .then(res => {
        console.log(res)
        setSystems(res)
        selectSystem(res.systems[0]) //The default system is the first selected one.
      })
  } 

  const [systemSelected, selectSystem] = useSessionStorage<System>('systemSelected')

  useEffect(() => {
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
    if (session===null) {
      setCookie('session', '', { path: '/ ', maxAge: 900})
    }
  }, [])

  return (
    <userContext.Provider value={{user: user, updateUser: updateUser}}>
      <systemsContext.Provider value={{systems: systems, updateSystems: updateSystems, systemSelected: systemSelected, selectSystem: selectSystem}}>
        <div className="Main">
          <SpaceMap system={systemSelected}/>
          <div className="Main_Margin">
            <div className="Main_ResponsiveGrid">
              <NavBar />
              <Money />
            </div>
          </div>
        </div>
      </systemsContext.Provider>
    </userContext.Provider>
  )
}

export default Main