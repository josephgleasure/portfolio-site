import React from "react";

const Overlay: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        color: "white",
        maxWidth: "600px",
        zIndex: 10,
        pointerEvents: "none",
        userSelect: "none", // Prevent text selection
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontFamily: "Handjet",
          fontWeight: "500",
          marginBottom: "10px",
          lineHeight: "0.5",
          cursor: "default", // Prevent text cursor
        }}
      >
        a constellation of stars
      </h1>
      <p
        style={{
          fontSize: "14px",
          fontFamily: "Handjet",
          fontWeight: "300",
          lineHeight: "1.1",
          marginBottom: "10px",
          opacity: "100",
          cursor: "default", // Prevent text cursor
        }}
      >
        through a casement window <br />
        reflected in a mirror in an empty room
      </p>
      <p
        style={{
          fontFamily: "Handjet",
          fontSize: "14px",
          lineHeight: "1.2",
          opacity: 0.8,
          cursor: "default", // Prevent text cursor
        }}
      ></p>
    </div>
  );
};

export default Overlay;
