const config = {
  get DEV_MODE() {
    return localStorage.getItem("devMode") === "true";
  },
  set DEV_MODE(value) {
    localStorage.setItem("devMode", value ? "true" : "false");
  },
  get MOCK_USER() {
    return {
      id: "12345",
    };
  },
};

export default config;
