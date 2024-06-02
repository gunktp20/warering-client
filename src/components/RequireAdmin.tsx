import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AccessTokenPayload } from "../features/auth/types";

function RequireAdmin() {
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);

  const decoded: AccessTokenPayload | undefined = token
    ? jwtDecode(token)
    : undefined;

  useEffect(() => {
    if (!user) {
      console.log("!user");
      navigate("/home");
      return;
    }
    const isAdmin = decoded?.roles.filter((role) => {
      return role === "admin";
    }).length;
    if (!isAdmin) {
      navigate("/unauthorized");
      return;
    }
  }, [user]);

  return <Outlet />;
}

export default RequireAdmin;
