import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

type Prop = {
  children: string | JSX.Element;
};

const isAllowed = "admin";

function RequireAdmin(props: Prop) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/unauthorized");
    }
    const isAdmin = user?.roles.filter((role) => {
      return role === isAllowed;
    }).length;
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, []);

  return props.children;
}

export default RequireAdmin;
