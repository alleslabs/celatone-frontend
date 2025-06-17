export const displayActionValue = (isActionName: string) => {
  switch (isActionName) {
    case "isClearAdmin":
      return "Clear admin";
    case "isExecute":
      return "Execute";
    case "isIbc":
      return "IBC";
    case "isInstantiate":
      return "Instantiate";
    case "isMigrate":
      return "Migrate";
    case "isMoveExecute":
      return "Execute function";
    case "isMovePublish":
      return "Publish module";
    case "isMoveScript":
      return "Run script";
    case "isOpinit":
      return "OPInit";
    case "isSend":
      return "Send";
    case "isStoreCode":
      return "Store code";
    case "isUpdateAdmin":
      return "Update admin";
    default:
      return "";
  }
};
