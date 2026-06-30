"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Inter, system-ui, sans-serif",
          background: "#FAFAF8",
          color: "#36454F",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Rackd encountered an error
          </h2>
          <p style={{ marginTop: "8px", opacity: 0.65, maxWidth: "28rem" }}>
            {error.message}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "24px",
              padding: "10px 20px",
              borderRadius: "16px",
              border: "none",
              background: "#36454F",
              color: "white",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Reload app
          </button>
        </div>
      </body>
    </html>
  );
}
