import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { logout, refreshToken } from "../../features/auth/authSlice";

function Overview() {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  return (
    <div className="flex flex-col">
      <div className="mb-5 mt-5">Overview</div>
      <div>
        Role :{" "}
        {user?.roles.map((role) => {
          return role;
        })}
      </div>
      <button
        id="logout-btn"
        onClick={async () => {
          const responseLogout = await dispatch(logout(token));
          if (responseLogout.payload === "Forbidden") {
            await dispatch(refreshToken());
            await dispatch(logout(token));
          }
        }}
        className="bg-red-500 text-white px-5 w-[200px] py-2 rounded-md"
      >
        Logout
      </button>
    </div>
  );
}

export default Overview;
