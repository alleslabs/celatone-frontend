import { Icon, useToast } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

import { EditableCell } from "lib/components/table";
import { MAX_CODE_DESCRIPTION_LENGTH } from "lib/data";
import { useCodeStore } from "lib/hooks";

interface CodeDescriptionCellProps {
  codeId: number;
  description?: string;
}

export const CodeDescriptionCell = ({
  codeId,
  description,
}: CodeDescriptionCellProps) => {
  const toast = useToast();
  const { updateCodeInfo } = useCodeStore();

  const onSave = (inputValue?: string) => {
    updateCodeInfo(codeId, { description: inputValue });
    toast({
      title: "New Code Description saved",
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: (
        <Icon
          as={MdCheckCircle}
          color="success.main"
          boxSize="6"
          display="flex"
          alignItems="center"
        />
      ),
    });
  };
  return (
    <EditableCell
      initialValue={description}
      defaultValue="No Description"
      maxLength={MAX_CODE_DESCRIPTION_LENGTH}
      onSave={onSave}
    />
  );
};
