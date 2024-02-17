import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface AccessTokenPayload {
  sub: string;
  username: string;
  roles: [];
  iat: number;
  exp: number;
}

function Overview() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const decoded: AccessTokenPayload | undefined = token
    ? jwtDecode(token)
    : undefined;

  const roles = decoded?.roles || [];
  console.log(roles)
  const isAdmin = roles.filter((role)=>{ return role == "admin"})
  console.log(isAdmin)
  
  useEffect(()=>{
    if(isAdmin){
      navigate("/admin")
    }
  })

  return (
    <div className="flex flex-col">
      <div className="mb-5 mt-5">
        Overview
      </div>
      <button id="logout-btn" onClick={() => {
        dispatch(logout())
        return;
      }} className="bg-red-500 text-white px-5 w-[200px] py-2 rounded-md">Logout</button>
    </div>
  )
}

export default Overview
