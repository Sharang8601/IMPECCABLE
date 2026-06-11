import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env BEFORE any module that reads process.env
dotenv.config({ path: join(__dirname, "..", ".env") });

const { default: app } = await import("./app.js");
const { connectDatabase } = await import("./config/database.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Impeccable Salon API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start API", error);
    process.exit(1);
  }
};

startServer();