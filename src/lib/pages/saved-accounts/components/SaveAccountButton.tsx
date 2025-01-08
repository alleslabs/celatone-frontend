import { CustomIcon } from "lib/components/icon";
import { SaveNewAccountModal } from "lib/components/modal";

export const SaveAccountButton = () => (
  <SaveNewAccountModal
    buttonProps={{
      children: "Save New Account",
      leftIcon: <CustomIcon name="bookmark" />,
      variant: "outline-primary",
    }}
  />
);
