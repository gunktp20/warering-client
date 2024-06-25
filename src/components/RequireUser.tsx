import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AccessTokenPayload } from "../features/auth/types";
function RequireUser() {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  const decoded: AccessTokenPayload | undefined = token
    ? jwtDecode(token)
    : undefined;

  useEffect(() => {
    if (!token) {
      navigate("/home");
      return;
    }

    const isAdmin = decoded?.roles.filter((role) => {
      return role === "admin";
    }).length;
    if (isAdmin) {
      navigate("/admin");
      return;
    }
  }, []);

  return <Outlet/>;
}

export default RequireUser;
