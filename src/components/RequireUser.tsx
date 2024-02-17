import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

type Prop = {
  children: string | JSX.Element;
};

const isAllowed = "user";

function RequireUser(props: Prop) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if(!user){
      navigate("/unauthorized");
    }
    const isUser = user?.roles.filter((role) => {
      return role === isAllowed;
    }).length;
    if (!isUser) {
      navigate("/unauthorized");
    }
  }, []);

  return props.children;
}

export default RequireUser;
