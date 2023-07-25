import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { CustomIcon } from "lib/components/icon";
import type { CodeInfo } from "lib/types";

import { EditCodeDetailsModal } from "./EditCodeDetails";
import { SaveCodeDetailsModal } from "./SaveCodeDetails";

interface SaveOrEditCodeModalProps {
  mode: "save" | "edit";
  codeInfo: CodeInfo;
}

export const SaveOrEditCodeModal = observer(
  ({ mode, codeInfo }: SaveOrEditCodeModalProps) =>
    mode === "save" ? (
      <SaveCodeDetailsModal
        codeInfo={codeInfo}
        triggerElement={
          <Button
            variant="outline-gray"
            size={{ base: "sm", md: "md" }}
            leftIcon={<CustomIcon name="bookmark" />}
          >
            Save Code
          </Button>
        }
      />
    ) : (
      <EditCodeDetailsModal
        codeInfo={codeInfo}
        triggerElement={
          <Button
            variant="ghost-gray"
            size={{ base: "sm", md: "md" }}
            leftIcon={<CustomIcon name="edit" />}
          >
            Edit
          </Button>
        }
      />
    )
);
