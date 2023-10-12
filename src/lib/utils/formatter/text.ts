export const removeSpecialChars = (text: string) =>
  text.replace(/[^a-zA-Z0-9]/g, "");
