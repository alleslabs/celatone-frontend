import { Flex, Icon, Text, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { MdAddCircleOutline, MdCheckCircle } from "react-icons/md";

import { ActionModal } from "..";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import { MAX_CODE_NAME_LENGTH } from "lib/data";
import { useCodeStore, useGetAddressType } from "lib/hooks";
import type { CodeLocalInfo } from "lib/stores/code";

interface CodeDetailsTemplateModalProps {
  title: string;
  helperText?: string;
  mainBtnTitle: string;
  isNewCode: boolean;
  codeLocalInfo: CodeLocalInfo;
  triggerElement: JSX.Element;
}

export const CodeDetailsTemplateModal = ({
  title,
  helperText,
  mainBtnTitle,
  isNewCode,
  codeLocalInfo,
  triggerElement,
}: CodeDetailsTemplateModalProps) => {
  const { saveNewCode, updateCodeInfo } = useCodeStore();
  const toast = useToast();
  const getAddressType = useGetAddressType();

  const [name, setName] = useState(codeLocalInfo.name ?? "");

  const uploaderType = getAddressType(codeLocalInfo.uploader);

  const handleAction = useCallback(() => {
    if (isNewCode) saveNewCode(codeLocalInfo.id);

    updateCodeInfo(codeLocalInfo.id, codeLocalInfo.uploader, name);

    // TODO: abstract toast to template later
    toast({
      title,
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
  }, [
    codeLocalInfo.id,
    codeLocalInfo.uploader,
    name,
    isNewCode,
    saveNewCode,
    title,
    toast,
    updateCodeInfo,
  ]);

  // fix prefilling blank space problem (e.g. name saved as "     ")
  useEffect(() => {
    setName(codeLocalInfo.name ?? "");
  }, [codeLocalInfo.name]);

  return (
    <ActionModal
      title={title}
      trigger={triggerElement}
      icon={MdAddCircleOutline}
      iconColor="text.dark"
      noHeaderBorder
      noCloseButton
      mainBtnTitle={mainBtnTitle}
      mainAction={handleAction}
      headerContent={
        <Flex direction="column">
          {helperText && (
            <Text variant="body1" mt={6}>
              {helperText}
            </Text>
          )}
          <Flex align="center" mb={2} mt={6}>
            <Text variant="body2" fontWeight={700} w="20%">
              Code ID
            </Text>
            <ExplorerLink type="code_id" value={codeLocalInfo.id.toString()} />
          </Flex>
          <Flex align="center">
            <Text variant="body2" fontWeight={700} w="20%">
              Uploader
            </Text>
            <ExplorerLink
              type={
                uploaderType !== "invalid_address" ? uploaderType : undefined
              }
              value={codeLocalInfo.uploader}
            />
          </Flex>
        </Flex>
      }
    >
      <TextInput
        variant="floating"
        value={name}
        setInputState={setName}
        size="lg"
        helperText="Fill in code name to define its use as a reminder"
        label="Code Name"
        labelBgColor="pebble.900"
        maxLength={MAX_CODE_NAME_LENGTH}
      />
    </ActionModal>
  );
};
