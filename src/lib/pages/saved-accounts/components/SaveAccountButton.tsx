import { CustomIcon } from "lib/components/icon";
import { SaveNewAccountModal } from "lib/components/modal";

export const SaveAccountButton = () => (
  <SaveNewAccountModal
    buttonProps={{
      children: "Save new account",
      leftIcon: <CustomIcon name="bookmark" />,
      variant: "outline-primary",
    }}
  />
);
