import React, { useReducer } from "react";

export const UserImageFashionsContext = React.createContext();

const initialState = {
  originalImage: null,
  items: [],
};

const reducer = (state, action) => action.value;

const UserImageFashionsContextProvider = ({ children }) => {
  const [state, contextDispatch] = useReducer(reducer, initialState);

  return (
    <UserImageFashionsContext.Provider value={{ state, contextDispatch }}>
      {children}
    </UserImageFashionsContext.Provider>
  );
};

export default UserImageFashionsContextProvider;
