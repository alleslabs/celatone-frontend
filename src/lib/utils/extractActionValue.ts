export const displayActionValue = (isActionName: string) => {
  switch (isActionName) {
    case "isClearAdmin":
      return "Clear Admin";
    case "isExecute":
      return "Execute";
    case "isIbc":
      return "IBC";
    case "isInstantiate":
      return "Instantiate";
    case "isMigrate":
      return "Migrate";
    case "isMoveExecute":
      return "Execute Function";
    case "isMovePublish":
      return "Publish Module";
    case "isMoveScript":
      return "Run Script";
    case "isMoveUpgrade":
      return "Upgrade Module";
    case "isOpinit":
      return "OPInit";
    case "isSend":
      return "Send";
    case "isStoreCode":
      return "Store Code";
    case "isUpdateAdmin":
      return "Update Admin";
    default:
      return "";
  }
};
