import { useNavigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { Role } from "../constant/types/Role";
import { useEffect } from "react";

interface Props {
  allow: Role;
}
const RequireAuth = ({ allow }: Props) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/landing");
      return;
    }
    const isAllowed = user?.roles.filter((role) => {
      return role === allow;
    }).length;
    if (!isAllowed) {
      navigate("/unauthorized");
      return;
    }
  }, []);

  return <Outlet />;
};
export default RequireAuth;
