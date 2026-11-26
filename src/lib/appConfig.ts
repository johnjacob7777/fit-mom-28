// ---------------------------------------------------------
// App Configuration — gates demo bypasses strictly to dev
// or explicit NEXT_PUBLIC_ENABLE_DEMO_MODE="true".
// ---------------------------------------------------------
export const IS_DEMO_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true" ||
  process.env.NODE_ENV !== "production";
