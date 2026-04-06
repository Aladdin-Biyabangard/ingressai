export const generateLink = (type, value) => {
  if (!value) return "";

  switch (type) {
    case "email":
      const [user, domain] = value.split("@");
      return `mailto:${user}@${domain}`;
    case "location":
      return `https://www.google.com/maps?q=${value}`;
    case "phone":
      return `tel:${value}`;
    default:
      return "";
  }
};
