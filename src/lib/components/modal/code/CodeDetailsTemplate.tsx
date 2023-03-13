import { Flex, Text, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import { ActionModal } from "../ActionModal";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { PermissionChip } from "lib/components/PermissionChip";
import { MAX_CODE_NAME_LENGTH } from "lib/data";
import { useCodeStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Addr, CodeInfo } from "lib/types";

interface CodeDetailsTemplateModalProps {
  title: string;
  helperText?: string;
  mainBtnTitle: string;
  isNewCode: boolean;
  codeInfo: CodeInfo;
  triggerElement: JSX.Element;
}

export const CodeDetailsTemplateModal = ({
  title,
  helperText,
  mainBtnTitle,
  isNewCode,
  codeInfo,
  triggerElement,
}: CodeDetailsTemplateModalProps) => {
  const { saveNewCode, updateCodeInfo } = useCodeStore();
  const toast = useToast();
  const getAddressType = useGetAddressType();

  const [name, setName] = useState(codeInfo.name ?? "");

  const uploaderType = getAddressType(codeInfo.uploader);

  const handleAction = useCallback(() => {
    if (isNewCode) {
      AmpTrack(AmpEvent.CODE_SAVE);
      saveNewCode(codeInfo.id);
    } else {
      AmpTrack(AmpEvent.CODE_EDIT);
    }

    updateCodeInfo(codeInfo.id, codeInfo.uploader as Addr, name);

    // TODO: abstract toast to template later
    toast({
      title,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });
  }, [
    codeInfo.id,
    codeInfo.uploader,
    name,
    isNewCode,
    saveNewCode,
    title,
    toast,
    updateCodeInfo,
  ]);

  // fix prefilling blank space problem (e.g. name saved as "     ")
  useEffect(() => {
    setName(codeInfo.name ?? "");
  }, [codeInfo.name]);

  return (
    <ActionModal
      title={title}
      trigger={triggerElement}
      icon="bookmark-solid"
      noHeaderBorder
      noCloseButton
      mainBtnTitle={mainBtnTitle}
      mainAction={handleAction}
      headerContent={
        <Flex direction="column" gap={2}>
          {helperText && (
            <Text variant="body1" mt={6}>
              {helperText}
            </Text>
          )}
          <Flex align="center" mt={4}>
            <Text variant="body2" fontWeight={700} w="30%">
              Code ID
            </Text>
            <ExplorerLink type="code_id" value={codeInfo.id.toString()} />
          </Flex>
          <Flex align="center">
            <Text variant="body2" fontWeight={700} w="30%">
              Uploader
            </Text>
            <ExplorerLink type={uploaderType} value={codeInfo.uploader} />
          </Flex>
          <Flex align="center">
            <Text variant="body2" fontWeight={700} w="30%">
              Instantiate Permission
            </Text>
            <PermissionChip
              instantiatePermission={codeInfo.instantiatePermission}
              permissionAddresses={codeInfo.permissionAddresses}
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
