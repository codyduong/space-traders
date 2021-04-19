import { useState, useEffect } from "react"
import "./css/Main.css"
// import { settingsDefault, settingsContext } from "./context/settingsContext"
// import settingsInterface from "./interfaces/settings"
import { userDefault, userContext } from "./context/userContext"
import userInterface from "./interfaces/user"
import { systemsDefault, systemsContext } from "./context/systemsContext"
// import systemsInterface from "./interfaces/systems"
import SpaceMap from "./SpaceMap"
import NavBar from "./NavBar"
import Money from "./Money"
import { useCookies } from "react-cookie"

import { SpaceTraders } from "spacetraders-sdk"

const spaceTraders = new SpaceTraders()
const token = require('./token.json')
spaceTraders.init('duongc', `${token.token}`)

const Main = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'systems'])
  // const [settings, setSettings] = useState<any>(settingsDefault)
  // const toggleTheme = () => {

  // }
  const [user, setUser] = useState<userInterface>(cookies.user ?? userDefault)
  const updateUser = (user: userInterface) => {
    spaceTraders.getAccount()
      .then(res => {
        console.log(res)
        let _: userInterface = {
          username: res.user.username,
          credits: res.user.credits,
          loans: res.user.loans,
          ships: res.user.ships,
        }
        setUser(_)
        setCookie('user', _, { path: '/ ' })
      })
  }

  const [systems, setSystems] = useState<any>(cookies.systems ?? systemsDefault)
  const updateSystems = (systems: any) => {
    spaceTraders.listSystems()
      .then(res => {
        let _: any = res //A dumb workaround for bad typing on the sdk side
        console.log(_.systems[0])
        setSystems(_)
        selectSystem(_.systems[0]) //The default system is the first selected one.
        setCookie('selectedSystem', _.systems[0], { path: '/ ' })
        setCookie('systems', _, { path: '/ ' })
      })
  } 

  const [systemSelected, selectSystem] = useState<any>(cookies.selectedSystem ?? null)

  useEffect(() => {
    if (!cookies.user) {
      spaceTraders.getAccount()
        .then(res => {
          console.log(res)
          let _: userInterface = {
            username: res.user.username,
            credits: res.user.credits,
            loans: res.user.loans,
            ships: res.user.ships,
          }
          setUser(_)
          setCookie('user', _, { path: '/ ' })
        })
    }
    if (!cookies.systems) {
      spaceTraders.listSystems()
        .then(res => {
          let _: any = res //A dumb workaround for bad typing on the sdk side
          console.log(_.systems[0])
          setSystems(_)
          selectSystem(_.systems[0]) //The default system is the first selected one.
          setCookie('selectedSystem', _.systems[0], { path: '/ ' })
          setCookie('systems', _, { path: '/ ' })
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