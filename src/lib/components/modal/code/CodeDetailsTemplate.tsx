import { Flex, Text, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { PermissionChip } from "lib/components/PermissionChip";
import { useCodeStore } from "lib/providers/store";
import type { CodeInfo } from "lib/types";
import { ActionModal } from "../ActionModal";

interface CodeDetailsTemplateModalProps {
  title: string;
  helperText?: string;
  mainBtnTitle: string;
  isNewCode: boolean;
  codeInfo: CodeInfo;
  triggerElement: JSX.Element;
  icon?: IconKeys;
}

export const CodeDetailsTemplateModal = ({
  title,
  helperText,
  mainBtnTitle,
  isNewCode,
  codeInfo,
  triggerElement,
  icon = "bookmark-solid",
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
      icon={icon}
      mainBtnTitle={mainBtnTitle}
      closeOnOverlayClick={false}
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
        variant="fixed-floating"
        value={name}
        setInputState={setName}
        size="lg"
        helperText="Fill in code name to define its use as a reminder"
        label="Code Name"
        labelBgColor="gray.900"
        maxLength={constants.maxCodeNameLength}
      />
    </ActionModal>
  );
};
