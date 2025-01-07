import { CustomIcon } from "lib/components/icon";
import { SaveNewCodeModal } from "lib/components/modal/code/SaveNewCode";

export const SaveCodeButton = () => (
  <SaveNewCodeModal
    buttonProps={{
      children: "Save New Code",
      leftIcon: <CustomIcon name="bookmark" />,
      variant: "outline-primary",
    }}
  />
);
