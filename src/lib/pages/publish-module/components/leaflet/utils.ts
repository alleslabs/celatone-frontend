export const structToString = (obj: Record<string, string>) => {
  const spacing = "\t";
  const keyValuePairs = Object.entries(obj).map(([key]) => {
    const value = obj[key];
    const [val, comment] = value.split("//");
    const commentRender = comment
      ? ` <span style='color: #B7B7B7;'>// ${comment.trim()}</span>`
      : "";
    return `${spacing}${key}: ${val.trim()}${commentRender}`;
  });
  return `<p>struct ExampleStruct {\n${keyValuePairs.join(",\n")}\n}</p>`;
};
