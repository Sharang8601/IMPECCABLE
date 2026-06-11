export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || "";
};

export const truncateText = (text, length = 60) => {
  if (!text || text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

export const getGoogleLoginUrl = (redirectPath) => {
  const base = `${import.meta.env.VITE_API_URL || "/api"}/auth/google`;
  if (redirectPath) {
    return `${base}?redirect=${encodeURIComponent(redirectPath)}`;
  }
  return base;
};