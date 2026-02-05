require("dotenv").config();
const { app } = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    console.log("▶️ Booting server...");

    await connectDB(process.env.MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
