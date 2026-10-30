import { config } from "dotenv";
config();

import app from "./app";

const PORT = parseInt(process.env.PORT || "3500", 10);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});