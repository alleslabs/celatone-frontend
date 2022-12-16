import { Icon, useToast } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

import { EditableCell } from "lib/components/table";
import { useCodeStore, useUserKey } from "lib/hooks";

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
  const userKey = useUserKey();

  const onSave = (inputValue?: string) => {
    updateCodeInfo(userKey, codeId, { description: inputValue });
    toast({
      title: "Changed description successfully!",
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
      onSave={onSave}
    />
  );
};
