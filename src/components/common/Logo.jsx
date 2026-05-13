import { useState } from "react";
import logo from "../../assets/logo-eru.svg";
import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <img
      src={logo}
      alt="Erudite — go to home page"
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("/")}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/")}
      style={{
        height: 25,
        width: 100,
        marginBottom: "5px",
        marginRight: "10px",
        cursor: "pointer",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        filter: hovered
          ? "drop-shadow(0 0 8px rgba(108, 142, 255, 0.55))"
          : "none",
        transition:
          "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.22s ease",
        userSelect: "none",
      }}
    />
  );
}
