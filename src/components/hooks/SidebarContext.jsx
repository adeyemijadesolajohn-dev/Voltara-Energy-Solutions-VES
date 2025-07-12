import { createContext, useReducer, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

const initialState = {
  isSidebarOpen: false,
};

const SidebarReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case "SET_SIDEBAR":
      return { ...state, isSidebarOpen: action.payload };
    default:
      throw new Error(`Unhandled action type: "${action.type}"`);
  }
};

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SidebarReducer, initialState);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }, []);

  const setSidebarOpen = useCallback((open) => {
    dispatch({ type: "SET_SIDEBAR", payload: open });
  }, []);

  const contextValue = useMemo(
    () => ({
      isSidebarOpen: state.isSidebarOpen,
      toggleSidebar,
      setSidebarOpen,
    }),
    [state.isSidebarOpen, toggleSidebar, setSidebarOpen]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

SidebarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
