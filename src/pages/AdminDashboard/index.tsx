import { useAppDispatch } from "../../app/hooks"
import { logout } from "../../features/auth/authSlice";

function AdminDashboard() {

  const dispatch = useAppDispatch();
  
  return (
    <div className="flex flex-col">
      <div className="mb-5 mt-5">
      AdminDashboard
      </div>
      <button id="logout-btn" onClick={()=>{
        dispatch(logout())
        return;
      }}className="bg-red-500 text-white px-5 w-[200px] py-2 rounded-md">Logout</button>
    </div>
  )
}

export default AdminDashboard
