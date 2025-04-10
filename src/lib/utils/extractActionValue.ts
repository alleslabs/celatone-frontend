export const displayActionValue = (isActionName: string) => {
  switch (isActionName) {
    case "isSend":
      return "Send";
    case "isIbc":
      return "IBC";
    case "isOpinit":
      return "OPInit";
    case "isStoreCode":
      return "Store code";
    case "isInstantiate":
      return "Instantiate";
    case "isExecute":
      return "Execute";
    case "isMigrate":
      return "Migrate";
    case "isClearAdmin":
      return "Clear admin";
    case "isUpdateAdmin":
      return "Update admin";
    case "isMovePublish":
      return "Publish module";
    case "isMoveUpgrade":
      return "Upgrade module";
    case "isMoveExecute":
      return "Execute function";
    case "isMoveScript":
      return "Run script";
    default:
      return "";
  }
};
