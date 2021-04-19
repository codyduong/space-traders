import "./css/NavBar.css"
import SelectSystem from "./SelectSystem"
import Ships from "./Ships"
import Locations from "./Locations"

const NavBar = (props: any) => {

  return (
    <div className="NavBar_Main">
      <div className="NavBar_Buttons">
        <SelectSystem selectSystem={props.selectSystem}/>
        <Ships />
        <Locations />
      </div>
    </div>
  )
}

export default NavBar