import "./css/NavBar.css"
import UserCredentials from "./UserCredentials"
import SelectSystem from "./SelectSystem"
import Ships from "./Ships"
import Locations from "./Locations"

const NavBar = () => {

  return (
    <div className="NavBar_Main">
      <div className="NavBar_Buttons">
        <UserCredentials />
        <SelectSystem/>
        <Ships />
        <Locations />
      </div>
    </div>
  )
}

export default NavBar