import React, { useState } from "react";

const AboutPage = () => {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="page-container">
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Hi, I'm Joseph</h1>

      <p>
        <em>
          I am a writer who specializes in art, design, and technology. I have
          created immersive branding experiences for C.P. Company, Puma, New Balance, Reebok,
          Lacoste, Dr Martens, Tombogo, Terminal 27, Vooglam, Wondershare Filmora, and more.
        </em>
      </p>

      <p>
        <em>
          I am currently located in Vancouver, B.C., and available for both short
          and long-term engagements. For more information, or to see more of my work,
          get in touch at any of the links below.
        </em>
      </p>

      <div style={{ marginTop: "1.25rem", lineHeight: 1.8 }}>
        <div>
          <strong>Email:</strong>{" "}
          {showEmail ? (
            <a href="mailto:josephgleasure@gmail.com">
              josephgleasure@gmail.com
            </a>
          ) : (
            <button
              onClick={() => setShowEmail(true)}
              style={{
                background: "none",
                border: "1px solid currentColor",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Show email
            </button>
          )}
        </div>

        <div>
          <strong>LinkedIn:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/josephgleasure/"
            target="_blank"
            rel="noreferrer"
          >
            linkedin.com/in/josephgleasure
          </a>
        </div>

        <div>
          <strong>Instagram:</strong>{" "}
          <a
            href="https://www.instagram.com/josephgleasure/"
            target="_blank"
            rel="noreferrer"
          >
            @josephgleasure
          </a>
        </div>

        <div>
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/josephgleasure"
            target="_blank"
            rel="noreferrer"
          >
            github.com/josephgleasure
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
