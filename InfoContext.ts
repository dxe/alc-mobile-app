import React from "react";

export const InfoContext = React.createContext({
  data: null as null | any,
  status: "",
  setStatus: (status: string) => {},
});
