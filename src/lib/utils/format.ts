export const formatUserKey = (chain: string, address: string) =>
  `${chain}-${address}`;

export const formatSlugName = (name: string) =>
  name.trim().toLowerCase().replace(/ /g, "-");

export const shortenName = (name: string, count = 10) =>
  name.length > count ? name.substring(0, count).concat("...") : name;

export const escapeControlChars = (value: string) =>
  value.replace(
    /(?![\t\n\r])\p{Cc}/gu,
    (char) => `\\x${char.charCodeAt(0).toString(16).padStart(2, "0")}`
  );
