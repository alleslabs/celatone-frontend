import { useToast } from "@chakra-ui/react";

import { EditableCell } from "../EditableCell";
import { CustomIcon } from "lib/components/icon";
import { MAX_CODE_NAME_LENGTH } from "lib/data";
import { useCodeStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { CodeLocalInfo } from "lib/stores/code";

interface CodeNameCellProps {
  code: CodeLocalInfo;
}

export const CodeNameCell = ({ code }: CodeNameCellProps) => {
  const toast = useToast();
  const { updateCodeInfo } = useCodeStore();

  const onSave = (inputValue?: string) => {
    AmpTrack(AmpEvent.USE_QUICK_EDIT_CODE);
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
      maxLength={MAX_CODE_NAME_LENGTH}
      onSave={onSave}
    />
  );
};
