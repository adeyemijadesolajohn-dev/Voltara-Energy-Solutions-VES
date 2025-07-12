const SidebarReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    default:
      throw new Error(`Unhandled action type: "${action.type}"`);
  }
};

export default SidebarReducer;
