import { createContext } from "react"; 
import { User } from "spacetraders-sdk/dist/types";

export const userDefault: User = {
  username: "",
  credits: 0,
  loans: [],
  ships: [],
}

export const userContext = createContext({
  user: userDefault,
  updateUser: (props: any) => {},
})