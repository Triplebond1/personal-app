const allowedOrigins = [
  "http://localhost:3000",
  process.env.URL,
].filter(Boolean);

export default allowedOrigins;