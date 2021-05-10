import UserCredentials from "./UserCredentials"
import SelectSystem from "./SelectSystem"
import Ships from "./Ships"
import Locations from "./Locations"

import "./styling/NavBar.scss"

const NavBar = () => {

  return (
    <div className="navbar-main">
      <div className="navbar_buttons">
        <UserCredentials />
        <SelectSystem/>
        <Ships />
        <Locations />
      </div>
    </div>
  )
}

export default NavBar