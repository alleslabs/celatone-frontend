export const displayActionValue = (isActionName: string) => {
  switch (isActionName) {
    case "isSend":
      return "Send";
    case "isIbc":
      return "IBC";
    case "isUpload":
      return "Upload";
    case "isInstantiate":
      return "Instantiate";
    case "isExecute":
      return "Execute";
    case "isMigrate":
      return "Migrate";
    case "isClearAdmin":
      return "Clear Admin";
    case "isUpdateAdmin":
      return "Update Admin";
    case "isMovePublish":
      return "Publish Module";
    case "isMoveUpgrade":
      return "Upgrade Module";
    case "isMoveExecute":
      return "Execute Function";
    case "isMoveScript":
      return "Run Script";
    default:
      return "";
  }
};
