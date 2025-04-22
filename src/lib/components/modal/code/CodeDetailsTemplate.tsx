import type { IconKeys } from "lib/components/icon";
import type { CodeInfo } from "lib/types";

import { Flex, Text, useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { PermissionChip } from "lib/components/PermissionChip";
import { useCodeStore } from "lib/providers/store";
import { useCallback, useEffect, useState } from "react";

import { ActionModal } from "../ActionModal";

interface CodeDetailsTemplateModalProps {
  codeInfo: CodeInfo;
  helperText?: string;
  icon?: IconKeys;
  isNewCode: boolean;
  mainBtnTitle: string;
  title: string;
  triggerElement: JSX.Element;
}

export const CodeDetailsTemplateModal = ({
  codeInfo,
  helperText,
  icon = "bookmark-solid",
  isNewCode,
  mainBtnTitle,
  title,
  triggerElement,
}: CodeDetailsTemplateModalProps) => {
  const { constants } = useCelatoneApp();
  const { saveNewCode, updateCodeInfo } = useCodeStore();
  const toast = useToast();
  const getAddressType = useGetAddressType();

  const [name, setName] = useState(codeInfo.name ?? "");

  const uploaderType = getAddressType(codeInfo.uploader);

  const handleAction = useCallback(() => {
    if (isNewCode) {
      track(AmpEvent.CODE_SAVE);
      saveNewCode(codeInfo.id);
    } else {
      track(AmpEvent.CODE_EDIT);
    }

    updateCodeInfo(codeInfo.id, codeInfo.uploader, name);

    // TODO: abstract toast to template later
    toast({
      duration: 5000,
      icon: <CustomIcon color="success.main" name="check-circle-solid" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title,
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
      closeOnOverlayClick={false}
      headerContent={
        <Flex direction="column" gap={2}>
          {helperText && (
            <Text mt={6} variant="body1">
              {helperText}
            </Text>
          )}
          <Flex align="center" mt={4}>
            <Text fontWeight={700} variant="body2" w="30%">
              Code ID
            </Text>
            <ExplorerLink type="code_id" value={codeInfo.id.toString()} />
          </Flex>
          <Flex align="center">
            <Text fontWeight={700} variant="body2" w="30%">
              Uploader
            </Text>
            <ExplorerLink type={uploaderType} value={codeInfo.uploader} />
          </Flex>
          <Flex align="center">
            <Text fontWeight={700} variant="body2" w="30%">
              Instantiate permission
            </Text>
            <PermissionChip
              instantiatePermission={codeInfo.instantiatePermission}
              permissionAddresses={codeInfo.permissionAddresses}
            />
          </Flex>
        </Flex>
      }
      icon={icon}
      mainAction={handleAction}
      mainBtnTitle={mainBtnTitle}
      title={title}
      trigger={triggerElement}
    >
      <TextInput
        helperText="Fill in code name to define its use as a reminder"
        label="Code name"
        labelBgColor="gray.900"
        maxLength={constants.maxCodeNameLength}
        setInputState={setName}
        size="lg"
        value={name}
        variant="fixed-floating"
      />
    </ActionModal>
  );
};
