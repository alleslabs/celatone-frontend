import { CustomIcon } from "lib/components/icon/CustomIcon";
import { SaveNewCodeModal } from "lib/components/modal/code/SaveNewCode";

export default () => {
  return (
    <SaveNewCodeModal
      buttonProps={{
        variant: "outline-primary",
        rightIcon: <CustomIcon name="bookmark" color="violet.light" />,
        children: "Save New Code",
      }}
    />
  );
};
