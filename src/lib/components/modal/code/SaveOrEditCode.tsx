import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { CustomIcon } from "lib/components/icon/CustomIcon";
import type { CodeLocalInfo } from "lib/stores/code";

import { EditCodeDetailsModal } from "./EditCodeDetails";
import { SaveCodeDetailsModal } from "./SaveCodeDetails";

interface SaveOrEditCodeModalProps {
  mode: "save" | "edit";
  codeLocalInfo: CodeLocalInfo;
}

export const SaveOrEditCodeModal = observer(
  ({ mode, codeLocalInfo }: SaveOrEditCodeModalProps) => {
    return mode === "save" ? (
      <SaveCodeDetailsModal
        codeLocalInfo={codeLocalInfo}
        triggerElement={
          <Button
            variant="outline-gray"
            leftIcon={<CustomIcon name="bookmark" />}
          >
            Save Code
          </Button>
        }
      />
    ) : (
      <EditCodeDetailsModal
        codeLocalInfo={codeLocalInfo}
        triggerElement={
          <Button variant="ghost-gray" leftIcon={<CustomIcon name="edit" />}>
            Edit
          </Button>
        }
      />
    );
  }
);
