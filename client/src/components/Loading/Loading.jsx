import React from "react";
import "./Loading.css";

export function Loading() {
  return (
    <div className="loading" role="status">
      <div className="lds-ripple"><div></div><div></div></div>
    </div>
  );
}
