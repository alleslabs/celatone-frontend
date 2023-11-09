import { CustomIcon } from "lib/components/icon";
import { SaveNewAccountModal } from "lib/components/modal/account";

export const SaveAccountButton = () => (
  <SaveNewAccountModal
    buttonProps={{
      variant: "outline-primary",
      leftIcon: <CustomIcon name="bookmark" />,
      children: "Save New Address",
    }}
  />
);
