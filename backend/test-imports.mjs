// test-imports.mjs - import route modules to reproduce import-time errors
process.env.CLIENT_URL =
  process.env.CLIENT_URL || "https://naber-chat.netlify.app";

(async () => {
  try {
    console.log("[test] importing auth.routes...");
    const auth = await import("./src/routes/auth.routes.js");
    console.log("[test] auth.routes imported");

    console.log("[test] importing message.routes...");
    const msg = await import("./src/routes/message.routes.js");
    console.log("[test] message.routes imported");

    console.log("[test] done.");
  } catch (err) {
    console.error("[test] import error:", err);
    console.error(err.stack);
    process.exit(1);
  }
})();
