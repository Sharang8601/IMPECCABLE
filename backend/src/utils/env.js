export const parseOrigins = (value = "") => {
  const origins = value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length ? origins : true;
};

export const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";