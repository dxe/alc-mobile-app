import React from "react";

export const ScheduleContext = React.createContext({
  data: null as null | any,
  status: "",
  setStatus: (status: string) => {},
});
