import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate, Outlet } from "react-router-dom";

function RequireAdmin() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/landing");
    }
    const isAdmin = user?.roles.filter((role) => {
      return role === "admin";
    }).length;
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [user]);

  return <Outlet />;
}

export default RequireAdmin;
