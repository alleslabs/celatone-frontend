import { CustomIcon } from "lib/components/icon";
import { SaveNewCodeModal } from "lib/components/modal/code/SaveNewCode";

export const SaveCodeButton = () => (
  <SaveNewCodeModal
    buttonProps={{
      children: "Save new code",
      leftIcon: <CustomIcon name="bookmark" />,
      variant: "outline-primary",
    }}
  />
);
