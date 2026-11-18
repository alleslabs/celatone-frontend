export const formatUserKey = (chain: string, address: string) =>
  `${chain}-${address}`;

export const formatSlugName = (name: string) =>
  name.trim().toLowerCase().replace(/ /g, "-");

export const shortenName = (name: string, count = 10) =>
  name.length > count ? name.substring(0, count).concat("...") : name;

export const escapeControlChars = (value: string) =>
  value.replace(
    // eslint-disable-next-line no-control-regex -- C0 only; JSON allows DEL/C1 raw
    /[\0-\x08\x0B\x0C\x0E-\x1F]/g,
    (char) => `\\x${char.charCodeAt(0).toString(16).padStart(2, "0")}`
  );
