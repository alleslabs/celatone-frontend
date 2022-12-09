export const jsonValidate = (text: string) => {
  try {
    if (text !== "") JSON.parse(text);
    if (text.trim().length === 0)
      throw new SyntaxError(`Can't use empty string`);
    return null;
  } catch (error) {
    return (error as SyntaxError).message;
  }
};

export const jsonPrettify = (text: string) => {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
};
