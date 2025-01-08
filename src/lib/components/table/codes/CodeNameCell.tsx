import { useToast } from "@chakra-ui/react";

import { EditableCell } from "../EditableCell";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useCodeStore } from "lib/providers/store";
import type { CodeLocalInfo } from "lib/stores/code";

interface CodeNameCellProps {
  code: CodeLocalInfo;
  isReadOnly?: boolean;
}

export const CodeNameCell = ({
  code,
  isReadOnly = false,
}: CodeNameCellProps) => {
  const { constants } = useCelatoneApp();
  const toast = useToast();
  const { updateCodeInfo } = useCodeStore();

  const onSave = (inputValue?: string) => {
    track(AmpEvent.USE_QUICK_EDIT_CODE);
    updateCodeInfo(code.id, code.uploader, inputValue);
    toast({
      duration: 5000,
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title: "New Code Name Saved",
    });
  };
  return (
    <EditableCell
      defaultValue="Untitled Name"
      initialValue={code.name}
      isReadOnly={isReadOnly}
      maxLength={constants.maxCodeNameLength}
      onSave={onSave}
    />
  );
};
