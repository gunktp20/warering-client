import React from "react";
import { Link } from "react-router-dom";

// type Props = {};

const Overview = () => {
  return (
    <div>
      <h1>Overview</h1>
      <Link className="text-lg text-blue-700 underline" to={"admin"}>Admin</Link>
    </div>
  );
};

export default Overview;
