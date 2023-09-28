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
    case "isPublish":
      return "Publish Module";
    case "isEntryExecute":
      return "Execute Function";
    case "isUpgrade":
      return "Upgrade Module";
    case "isScript":
      return "Run Script";
    default:
      return "";
  }
};
