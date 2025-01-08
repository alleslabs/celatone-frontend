import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { CustomIcon } from "lib/components/icon";
import type { CodeInfo } from "lib/types";

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
        triggerElement={
          <Button
            size={{ base: "sm", md: "md" }}
            variant="outline-gray"
            leftIcon={<CustomIcon name="bookmark" />}
          >
            Save Code
          </Button>
        }
        codeInfo={codeInfo}
      />
    ) : (
      <EditCodeDetailsModal
        triggerElement={
          <Button
            size={{ base: "sm", md: "md" }}
            variant="ghost-gray"
            leftIcon={<CustomIcon name="edit" />}
          >
            Edit
          </Button>
        }
        codeInfo={codeInfo}
      />
    )
);
