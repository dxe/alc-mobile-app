import React from "react";

export const UserContext = React.createContext({
  onUserRegistered: (id: string, name: string) => {},
});
