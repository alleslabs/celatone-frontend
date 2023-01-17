export const tokenType = (type: string) => {
  switch (type.toLowerCase()) {
    case "ibc":
    case "cw20":
      return type.toUpperCase();
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
};
