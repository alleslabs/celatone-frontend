import { Button, chakra, Flex, Icon, Text, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import {
  MdAddCircleOutline,
  MdBookmark,
  MdCheckCircle,
  MdMode,
} from "react-icons/md";

import type { ActionModalProps } from "..";
import { ActionModal } from "..";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import { MAX_CODE_DESCRIPTION_LENGTH } from "lib/data";
import { useCodeStore, useGetAddressType } from "lib/hooks";
import type { CodeInfo } from "lib/types";

interface SaveOrEditCodeModalProps extends Omit<CodeInfo, "contracts"> {
  mode: "save" | "edit";
}

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "18px",
  },
});

export const SaveOrEditCodeModal = observer(
  ({
    mode,
    id,
    uploader,
    description: savedDesc = "",
  }: SaveOrEditCodeModalProps) => {
    const { saveNewCode, updateCodeInfo } = useCodeStore();
    const toast = useToast();
    const getAddressType = useGetAddressType();

    const [description, setDescription] = useState(savedDesc);

    const isSaveMode = mode === "save";
    const uploaderType = getAddressType(uploader);

    const handleAction = useCallback(() => {
      if (isSaveMode) saveNewCode(id);

      updateCodeInfo(id, {
        uploader,
        description,
      });

      // TODO: abstract toast to template later
      toast({
        title: isSaveMode
          ? `Saved ’${description || id}’ to Saved Codes`
          : "New Code Description saved",
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
      description,
      id,
      isSaveMode,
      saveNewCode,
      toast,
      updateCodeInfo,
      uploader,
    ]);

    const modeBoundProps: Pick<
      ActionModalProps,
      "title" | "trigger" | "mainBtnTitle"
    > = isSaveMode
      ? {
          title: "Save New Code",
          trigger: (
            <Button
              variant="outline-gray"
              leftIcon={<StyledIcon as={MdBookmark} />}
            >
              Save Code
            </Button>
          ),
          mainBtnTitle: "Save New Code",
        }
      : {
          title: "Edit Code Description",
          trigger: (
            <Button variant="ghost-gray" leftIcon={<StyledIcon as={MdMode} />}>
              Edit
            </Button>
          ),
          mainBtnTitle: "Save",
        };

    // fix prefilling blank space problem (e.g. description saved as "     ")
    useEffect(() => {
      setDescription(savedDesc);
    }, [savedDesc]);

    return (
      <ActionModal
        {...modeBoundProps}
        icon={MdAddCircleOutline}
        iconColor="text.dark"
        noHeaderBorder
        noCloseButton
        mainAction={handleAction}
        headerContent={
          <Flex direction="column">
            {isSaveMode && (
              <Text variant="body1" my={6}>
                Save other stored codes to your &quot;Saved Codes&quot; list
              </Text>
            )}
            <Flex align="center" mb={2} mt={isSaveMode ? 0 : 6}>
              <Text variant="body2" fontWeight={700} w="20%">
                Code ID
              </Text>
              <ExplorerLink value={id.toString()} />
            </Flex>
            <Flex align="center">
              <Text variant="body2" fontWeight={700} w="20%">
                Uploader
              </Text>
              {uploader ? (
                <ExplorerLink
                  type={
                    uploaderType !== "invalid_address"
                      ? uploaderType
                      : undefined
                  }
                  value={uploader}
                />
              ) : (
                <Text variant="body2" color="text.dark">
                  N/A
                </Text>
              )}
            </Flex>
          </Flex>
        }
      >
        <TextInput
          variant="floating"
          value={description}
          setInputState={setDescription}
          size="lg"
          helperText="Fill in code description to define its use as a reminder"
          label="Code Description"
          labelBgColor="gray.800"
          maxLength={MAX_CODE_DESCRIPTION_LENGTH}
        />
      </ActionModal>
    );
  }
);
