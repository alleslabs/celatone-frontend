export const formatUserKey = (chain: string, address: string) =>
  `${chain}-${address}`;

export const formatSlugName = (name: string) =>
  name.trim().toLowerCase().replace(/ /g, "-");

export const shortenName = (name: string, count = 10) =>
  name.length > count ? name.substring(0, count).concat("...") : name;
