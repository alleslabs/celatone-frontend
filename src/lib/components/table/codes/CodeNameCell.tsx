import type { CodeLocalInfo } from "lib/stores/code";

import { useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useCodeStore } from "lib/providers/store";

import { EditableCell } from "../EditableCell";

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
      title: "New code name saved",
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon color="success.main" name="check-circle-solid" />,
    });
  };
  return (
    <EditableCell
      initialValue={code.name}
      defaultValue="Untitled name"
      maxLength={constants.maxCodeNameLength}
      onSave={onSave}
    />
  );
};
