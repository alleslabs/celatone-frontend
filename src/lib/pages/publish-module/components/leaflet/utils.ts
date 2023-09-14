export const structToString = (obj: Record<string, string>, indent = 4) => {
  const spacing = " ".repeat(indent);
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map((key) => {
    const value = obj[key];
    const [val, comment] = value.split("//");
    const commentRender = comment
      ? ` <span style='color: #B7B7B7;'>// ${comment.trim()}</span>`
      : "";
    return `${spacing}${key}: ${val.trim()}${commentRender}`;
  });
  return `struct ExampleStruct {\n${keyValuePairs.join(",\n")}\n}`;
};
