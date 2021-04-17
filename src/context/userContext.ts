import { createContext } from "react"; 
import userInterface from "../interfaces/user"

export const userDefault: userInterface = {
  username: "",
  credits: 0,
  loans: null,
  ships: null,
}

export const userContext = createContext({
  user: userDefault,
  updateUser: (props: any) => {},
})