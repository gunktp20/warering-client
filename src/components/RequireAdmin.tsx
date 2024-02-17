import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";

type Prop = {
  children: string | JSX.Element;
};

function RequireAdmin(props: Prop) {
  const { user } = useAppSelector()
  const decoded: AccessTokenPayload | undefined = token
    ? jwtDecode(token)
    : undefined;

  useEffect(() => {
    console.log("require admin");
  }, []);

  return props.children;
}

export default RequireAdmin;
