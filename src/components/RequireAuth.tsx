import { useLocation, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAppSelector } from "../app/hooks";
import { Role, Roles } from "../constant/types/Role";
import React from "react";

interface AccessTokenPayload {
  sub: string;
  username: string;
  roles: [];
  iat: number;
  exp: number;
}
interface Props {
  allowedRoles: Roles;
}
const RequireAuth = ({ allowedRoles }: Props) => {
  const location = useLocation();
  const decoded: AccessTokenPayload | undefined = token
    ? jwtDecode(token)
    : undefined;

  const roles = decoded?.roles || [];
  console.log(decoded);

  return roles.find((role: Role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : token ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/landing" state={{ from: location }} replace />
  );
};
export default RequireAuth;
