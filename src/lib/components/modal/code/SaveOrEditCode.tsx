import { Button, chakra, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { MdBookmark, MdMode } from "react-icons/md";

import type { CodeLocalInfo } from "lib/stores/code";

import { EditCodeDetails } from "./EditCodeDetails";
import { SaveCodeDetails } from "./SaveCodeDetails";

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
      <SaveCodeDetails
        codeLocalInfo={codeLocalInfo}
        triggerElement={
          <Button
            variant="outline-gray"
            leftIcon={<StyledIcon as={MdBookmark} />}
          >
            Save Code
          </Button>
        }
      />
    ) : (
      <EditCodeDetails
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
