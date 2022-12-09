import { MdBookmarkBorder } from "react-icons/md";

import { SaveNewCodeModal } from "lib/components/modal/code/SaveNewCode";

export default () => {
  return (
    <SaveNewCodeModal
      buttonProps={{
        variant: "outline-primary",
        rightIcon: <MdBookmarkBorder />,
        children: "Save New Code",
      }}
    />
  );
};
