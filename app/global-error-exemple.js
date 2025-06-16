// app/global-error.js
"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body
        style={{
          padding: "3rem",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>Une erreur critique est survenue</h1>
        <p style={{ color: "red" }}>{error.message}</p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
