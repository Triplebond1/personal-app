"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "#fff",
            color: "#18181b",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "420px" }}>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "2px",
                color: "#a1a1aa",
                textTransform: "uppercase",
              }}
            >
              Critical error
            </p>

            <h1 style={{ fontSize: "32px", marginTop: "24px" }}>
              Something went wrong.
            </h1>

            <p
              style={{
                color: "#71717a",
                lineHeight: 1.7,
                marginTop: "16px",
              }}
            >
              An unexpected problem prevented this page from loading.
              Please try again.
            </p>

            <button
              onClick={() => reset()}
              style={{
                marginTop: "28px",
                padding: "12px 24px",
                background: "#18181b",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}