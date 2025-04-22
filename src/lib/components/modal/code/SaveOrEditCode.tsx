import type { CodeInfo } from "lib/types";

import { Button } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { observer } from "mobx-react-lite";

import { EditCodeDetailsModal } from "./EditCodeDetails";
import { SaveCodeDetailsModal } from "./SaveCodeDetails";

interface SaveOrEditCodeModalProps {
  codeInfo: CodeInfo;
  mode: "edit" | "save";
}

export const SaveOrEditCodeModal = observer(
  ({ codeInfo, mode }: SaveOrEditCodeModalProps) =>
    mode === "save" ? (
      <SaveCodeDetailsModal
        codeInfo={codeInfo}
        triggerElement={
          <Button
            leftIcon={<CustomIcon name="bookmark" />}
            size={{ base: "sm", md: "md" }}
            variant="outline-gray"
          >
            Save code
          </Button>
        }
      />
    ) : (
      <EditCodeDetailsModal
        codeInfo={codeInfo}
        triggerElement={
          <Button
            leftIcon={<CustomIcon name="edit" />}
            size={{ base: "sm", md: "md" }}
            variant="ghost-gray"
          >
            Edit
          </Button>
        }
      />
    )
);
