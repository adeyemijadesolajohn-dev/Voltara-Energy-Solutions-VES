import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../hooks/SidebarContext";
import { NavigationLinks, NavigationLowerLinks } from "../../data/SidebarData";
import { Icons, Public } from "../../data/Assets";

const API_ENDPOINT = "https://trickuweb.com/upload/profile_pic";
const AUTH_TOKEN = "adhgsdaksdhk938742937423"; // Replace with real token

const Sidebar = () => {
  const { isSidebarOpen } = useContext(SidebarContext);
  const location = useLocation();
  const sidebarClass = isSidebarOpen ? "sidebarDown" : "";

  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const [logo, setLogo] = useState("");

  // Retrieve user ID from local storage for dynamic navigation
  const userId = localStorage.getItem("userId");

  // Create preview URL for selected logo
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogo(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const selectFile = useCallback((e) => {
    const picked = e.target.files?.[0];
    if (picked) setFile(picked);
  }, []);

  const uploadFile = useCallback(async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        body: formData,
      });

      // Handle non-OK responses from the server
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Upload failed with status:", res.status, errorData);
        throw new Error("Server response was not ok.");
      }

      const { img_url } = await res.json();
      if (img_url) setLogo(img_url);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
    }
  }, [file]);

  // dynamically create links with the userId
  const renderNavLinks = useCallback(
    (links) =>
      links.map(({ id, link, icon: Icon, title }) => {
        // Construct the dynamic link if a userId exists and the link is not for logout
        const dynamicLink =
          userId && link !== "/Logout" ? `${link}/${userId}` : link;

        return (
          <li
            key={id}
            className={`navObject ${
              location.pathname.includes(link) ? "active" : ""
            }`}
            data-tooltip={title}
          >
            <Link to={dynamicLink || "#"} className="navPath">
              <Icon className="navIcon" />
              <span className="navText">{title}</span>
            </Link>
          </li>
        );
      }),
    [location.pathname, userId]
  );

  const previewImage = useMemo(
    () => (
      <img
        src={logo || Public.Placeholder}
        alt="Logo"
        className="clientLogoPhoto"
      />
    ),
    [logo]
  );

  return (
    <aside className={`sideBarContainer ${sidebarClass}`}>
      <div className="sideBarContent">
        {/* ─── Top ─── */}
        <header className="sideBarTop">
          <figure
            className="clientLogoImg"
            onClick={() => fileInput.current?.click()}
          >
            {previewImage}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              id="clientLogoFile"
              onChange={selectFile}
            />
            {file && (
              <button id="uploadBtn" onClick={uploadFile}>
                <Icons.Upload className="uploadIcon" />
              </button>
            )}
          </figure>
          <h2 className="clientName">Company Name</h2>
        </header>

        <hr />

        {/* ─── Center Navigation ─── */}
        <section className="sideBarCenter">
          <nav className="navContainer">
            <ul className="navContent">
              <li
                className={`navObject ${
                  location.pathname === `/SelectDashboard/${userId}`
                    ? "active"
                    : ""
                }`}
                data-tooltip="Overview"
              >
                <Link
                  to={userId ? `/SelectDashboard/${userId}` : "/"}
                  className="navPath"
                >
                  <Icons.Overview className="navIcon" />
                  <span className="navText">Overview</span>
                </Link>
              </li>
            </ul>
          </nav>

          <hr />

          <nav className="navContainer">
            <ul className="navContent">{renderNavLinks(NavigationLinks)}</ul>
          </nav>
        </section>

        <hr />

        {/* ─── Bottom Navigation ─── */}
        <footer className="sideBarBottom">
          <nav className="navContainer">
            <ul className="navContent">
              {renderNavLinks(NavigationLowerLinks)}
            </ul>
          </nav>
        </footer>
      </div>
    </aside>
  );
};

export default Sidebar;
