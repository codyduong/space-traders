import Ships from "./Ships"
import Locations from "./Locations"
import "./css/NavBar.css"

const NavBar = () => {

  return (
    <div className="NavBar_Main">
      <div className="NavBar_Buttons">
        <Ships />
        <Locations />
      </div>
    </div>
  )
}

export default NavBar