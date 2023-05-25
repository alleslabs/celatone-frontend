export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export const removeSpecialChars = (text: string) =>
  text.replace(/[^a-zA-Z0-9]/g, "");
