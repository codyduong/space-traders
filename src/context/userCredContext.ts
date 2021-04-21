import { createContext } from "react"
import { UserCred } from "../types"

export const userCredDefault: UserCred = {
  username: '',
  token: '',
}

export const userCredContext = createContext({
  userCred: userCredDefault,
  updateUserCred: (prop: UserCred) => {},
})