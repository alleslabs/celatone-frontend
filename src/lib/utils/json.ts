export const jsonValidate = (text: string) => {
  try {
    if (text.trim().length === 0)
      throw new SyntaxError(`Can't use empty string`);
    JSON.parse(text);
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

export const jsonLineCount = (text: string) => text.split(/\n/).length;

export const parseSchemaInitialData = (
  json: string
): Record<string, unknown> => {
  try {
    return JSON.parse(json);
  } catch (_) {
    return {};
  }
};
