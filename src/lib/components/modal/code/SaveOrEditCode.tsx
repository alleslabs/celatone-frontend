import type { CodeInfo } from "lib/types";

import { Button } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { observer } from "mobx-react-lite";

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
            leftIcon={<CustomIcon name="bookmark" />}
            size={{ base: "sm", md: "md" }}
            variant="outline-gray"
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
