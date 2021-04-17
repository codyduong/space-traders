import { useState, useContext } from "react"
import { userContext } from "./context/userContext"
import "./css/Money.css"

const Money = () => {

  return (
    <userContext.Consumer>
      {({ user }) => (
        <div className="Money_Main">
          Credits: {user.credits}
        </div>
      )}
    </userContext.Consumer>
  )
}

export default Money