import React from "react";

export const UserContext = React.createContext({
  userDeviceID: "",
  setUserDeviceID: (id: string) => {},
  registeredConferenceID: 0,
  setRegisteredConferenceID: (id: number) => {},
});
