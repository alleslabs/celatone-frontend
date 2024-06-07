import { useToast } from "@chakra-ui/react";

import { EditableCell } from "../EditableCell";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useCodeStore } from "lib/providers/store";
import type { CodeLocalInfo } from "lib/stores/code";

interface CodeNameCellProps {
  code: Partial<CodeLocalInfo>;
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

    if (code.id && code.uploader)
      updateCodeInfo(code.id, code.uploader, inputValue);

    toast({
      title: "New Code Name Saved",
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });
  };
  return (
    <EditableCell
      initialValue={code.name}
      defaultValue="Untitled Name"
      maxLength={constants.maxCodeNameLength}
      onSave={onSave}
      isReadOnly={isReadOnly}
    />
  );
};
