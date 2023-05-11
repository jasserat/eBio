/* eslint-disable */
import { useContext } from "react";
import AuthContext from "./AuthContext";
const useAuthContext = () => {
  const user = useContext(AuthContext);
console.log(user)
  if (user === null) {
    throw new Error("useAuthContext can only be used inside AuthProvider");
  }
  return user;
};

export default useAuthContext;