import React from "react";

export const ScheduleContext = React.createContext({
  data: null as null | any,
  setData: (data: any) => {},
  status: "",
  setStatus: (status: string) => {},
});
