import { Button, chakra, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { MdBookmarkBorder, MdMode } from "react-icons/md";

import type { CodeInfo } from "lib/types";

import { EditCodeDetailsModal } from "./EditCodeDetails";
import { SaveCodeDetailsModal } from "./SaveCodeDetails";

interface SaveOrEditCodeModalProps {
  mode: "save" | "edit";
  codeInfo: CodeInfo;
}

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "18px",
  },
});

export const SaveOrEditCodeModal = observer(
  ({ mode, codeInfo }: SaveOrEditCodeModalProps) =>
    mode === "save" ? (
      <SaveCodeDetailsModal
        codeInfo={codeInfo}
        triggerElement={
          <Button
            variant="outline-gray"
            leftIcon={<StyledIcon as={MdBookmarkBorder} />}
          >
            Save Code
          </Button>
        }
      />
    ) : (
      <EditCodeDetailsModal
        codeInfo={codeInfo}
        triggerElement={
          <Button variant="ghost-gray" leftIcon={<StyledIcon as={MdMode} />}>
            Edit
          </Button>
        }
      />
    )
);
