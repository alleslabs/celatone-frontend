import { Button, chakra, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { MdBookmarkBorder, MdMode } from "react-icons/md";

import type { CodeLocalInfo } from "lib/stores/code";

import { EditCodeDetailsModal } from "./EditCodeDetails";
import { SaveCodeDetailsModal } from "./SaveCodeDetails";

interface SaveOrEditCodeModalProps {
  mode: "save" | "edit";
  codeLocalInfo: CodeLocalInfo;
}

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "18px",
  },
});

export const SaveOrEditCodeModal = observer(
  ({ mode, codeLocalInfo }: SaveOrEditCodeModalProps) => {
    return mode === "save" ? (
      <SaveCodeDetailsModal
        codeLocalInfo={codeLocalInfo}
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
        codeLocalInfo={codeLocalInfo}
        triggerElement={
          <Button variant="ghost-gray" leftIcon={<StyledIcon as={MdMode} />}>
            Edit
          </Button>
        }
      />
    );
  }
);
