export const camelToTitle = (text: string) => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const snakeToTitle = (text: string) => {
  return text
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => ` ${c.toUpperCase()}`);
};

export const convertToTitle = (text: string) => {
  return text.includes("_") ? snakeToTitle(text) : camelToTitle(text);
};
