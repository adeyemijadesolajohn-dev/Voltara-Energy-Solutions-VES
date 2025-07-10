import React, { useState, useEffect, useRef } from "react";
import "./LandingPage.scss";
import "../../App.scss";
import { Link } from "react-router-dom";
import { Icons, Socials, Public } from "../../data/Assets";
import ImageSlider from "../../components/imageSlider/ImageSlider";

const menuItems = ["Main", "About", "Services", "Contact"];
const meterTypes = ["Smart Meters", "Static Meters", "Electronic Meters"];
const occupantTypes = ["Landlord", "Tenant", "Government Agency"];
const contentManagement = [
  "Single Phase Energy Meter",
  "Three Phase Energy Meter",
  "Home Electricity Usage",
];
const socialLinks = [
  { name: "Instagram", src: Socials.Instagram },
  { name: "Facebook", src: Socials.Facebook },
  { name: "X", src: Socials.eX },
];
const contacts = [
  { text: "+234 811 816 4299", icon: <Icons.Phone /> },
  { text: "voltaraenergy@gmail.com", icon: <Icons.Mail /> },
  { text: "13982653087", icon: <Icons.Whatsapp /> },
  { text: "13982653087", icon: <Icons.Skype /> },
];

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onEsc);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <div className="landingPage">
      <div className="landingContainer">
        <nav className="navBar whiteBackground" ref={navRef}>
          <div className="navLogo" onClick={() => setMenuOpen(false)}>
            <img src={Public.Logo} alt="Voltara Logo" />
            <div className="navLogoText">
              <h4>Voltara</h4>
              <p>Energy Solutions</p>
            </div>
          </div>

          {!menuOpen && (
            <div
              className="sideMenuIcon"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Icons.Menu />
            </div>
          )}

          <div className={`navLinks ${menuOpen ? "show sidebarPrimary" : ""}`}>
            <div className="sideBarUpper">
              <ul className="menuBar" onClick={() => setMenuOpen(false)}>
                {menuItems.map((item) => (
                  <li className="menuBarItems" key={item}>
                    <a href="#" className="menuBarLink">
                      {item}
                    </a>
                    <div className="chevronDown">
                      <Icons.ArrowDown className="arrowDown" />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="navLogin">
                <Link to="/Login" onClick={() => setMenuOpen(false)}>
                  <button className="btn">
                    <span>Sign In</span>
                  </button>
                </Link>
                <Link to="/Register" onClick={() => setMenuOpen(false)}>
                  <button className="btn">
                    <span>Sign Up</span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="navSocials">
              {socialLinks.map(({ name, src }) => (
                <a href="#" key={name}>
                  <img src={src} alt={name} />
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="largeStatement">
          <h1 className="statement">
            Streamline Customer & Account Management with Our Powerful
            Enterprise Solution
          </h1>
        </div>

        <ImageSlider className="landingSlider" />

        <footer className="footer">
          <div className="footerContainer">
            <div className="footerContent">
              <div className="footerList">
                <h3 className="footerHeading">Enterprise Content Management</h3>
                {contentManagement.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>

              <div className="footerList footMiddle">
                <h3 className="footerHeading">Meter Phase</h3>
                {meterTypes.map((type) => (
                  <p key={type}>{type}</p>
                ))}
              </div>

              <div className="footerList footMiddle">
                <h3 className="footerHeading">Occupant Type</h3>
                {occupantTypes.map((type) => (
                  <p key={type}>{type}</p>
                ))}
              </div>

              <div className="footerList footMiddle">
                <h3 className="footerHeading">Follow Us</h3>
                <div className="footSocials">
                  {socialLinks.map(({ name, src }) => (
                    <a href="#" key={name}>
                      <img src={src} alt={name} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="footerList footRight">
                <h3 className="footerHeading">Contact Us</h3>
                {contacts.map(({ text, icon }, index) => (
                  <div className="footerContact" key={index}>
                    <p>{text}</p>
                    <div className="contactIcon">{icon}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="footerBottom">
              <p>
                <a href="#">Privacy Policy</a> |{" "}
                <a href="#">Terms &amp; Conditions</a>
              </p>
              <div className="copyright">
                <p>© 2025 Voltara Energy Solutions. All rights reserved.</p>
              </div>
              <div className="poweredBy">
                <p>
                  Powered by <span className="footVoltara">Voltara</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
