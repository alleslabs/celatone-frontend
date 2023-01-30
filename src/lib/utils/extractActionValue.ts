export const displayActionValue = (isActionName: string) => {
  switch (isActionName) {
    case "isUpload":
      return "Upload";
    case "isInstantiate":
      return "Instantiate";
    case "isExecute":
      return "Execute";
    case "isSend":
      return "Send";
    case "isIbc":
      return "IBC";
    case "isMigrate":
      return "Migrate";
    case "isClearAdmin":
      return "Clear Admin";
    case "isUpdateAdmin":
      return "Update Admin";
    default:
      return "";
  }
};
