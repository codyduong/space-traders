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
import { useLocalStorage } from "./hooks/storageHooks"
import { System, User } from "spacetraders-sdk/dist/types"
import SpaceTradersExtend from "./spacetraders/spacetraders"

const token = require('./token.json')
const spaceTraders = new SpaceTradersExtend()
spaceTraders.init('duongc', `${token.token}`)

const Main = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'systems'])
  // const [settings, setSettings] = useState<any>(settingsDefault)
  // const toggleTheme = () => {

  // }
  const [user, setUser] = useState<User>(cookies.user ?? userDefault)
  const updateUser = (user: User) => {
    spaceTraders.getAccount()
      .then(res => {
        console.log(res.user)
        setUser(res.user)
        setCookie('user', res.user, { path: '/ ', maxAge: 900 }) //every 15 minutes
      })
  }

  const [systems, setSystems] = useLocalStorage<SystemsResponse>('systems')
  const updateSystems = (systems: any) => {
    spaceTraders.listSystemsFixed()
      .then(res => {
        console.log(res)
        setSystems(res)
        selectSystem(res.systems[0]) //The default system is the first selected one.
      })
  } 

  const [systemSelected, selectSystem] = useLocalStorage<System>('systemSelected')

  useEffect(() => {
    if (!cookies.user) {
      spaceTraders.getAccount()
        .then(res => {
          console.log(res)
          setUser(res.user)
          setCookie('user', res.user, { path: '/ ' })
        })
    }
    if (systems===null) {
      spaceTraders.listSystems()
        .then(res => {
          let _: any = res //A dumb workaround for bad typing on the sdk side
          console.log(_.systems[0])
          setSystems(_)
          selectSystem(_.systems[0]) //The default system is the first selected one.
        })
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