import React from "react";

type Prop = {
  children: string | JSX.Element;
};

function RequireUser(props: Prop) {
  return props.children;
}

export default RequireUser;
