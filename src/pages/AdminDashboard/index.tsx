import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function AdminDashboard() {
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { user, token } = useAppSelector((state) => state.auth);

  const signOut = async () => {
    dispatch(logout());
    await axiosPrivate.post(
      `/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-5 mt-5">AdminDashboard</div>
      <div>
        Role :{" "}
        {user?.roles.map((role) => {
          return role;
        })}
      </div>
      <button
        id="logout-btn"
        onClick={signOut}
        className="bg-red-500 text-white px-5 w-[200px] py-2 rounded-md"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
