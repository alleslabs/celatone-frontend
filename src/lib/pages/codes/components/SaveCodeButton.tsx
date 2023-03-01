import { MdBookmarkBorder } from "react-icons/md";

import { SaveNewCodeModal } from "lib/components/modal";

export default () => (
  <SaveNewCodeModal
    buttonProps={{
      variant: "outline-primary",
      rightIcon: <MdBookmarkBorder />,
      children: "Save New Code",
    }}
  />
);
