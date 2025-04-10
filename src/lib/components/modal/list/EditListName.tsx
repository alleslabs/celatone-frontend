import type { MenuItemProps } from "@chakra-ui/react";
import type { FormStatus } from "lib/components/forms";
import type { LVPair } from "lib/types";

import { MenuItem, useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useInternalNavigate } from "lib/app-provider";
import { TextInput } from "lib/components/forms/TextInput";
import { CustomIcon } from "lib/components/icon";
import { ActionModal } from "lib/components/modal/ActionModal";
import { useGetMaxLengthError } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { formatSlugName, shortenName } from "lib/utils";
import { useEffect, useState } from "react";

interface EditListNameModalProps {
  list: LVPair;
  menuItemProps: MenuItemProps;
  reroute?: boolean;
}
export function EditListNameModal({
  list,
  menuItemProps,
  reroute = false,
}: EditListNameModalProps) {
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();
  const { renameList, isContractListExist } = useContractStore();
  const navigate = useInternalNavigate();
  const toast = useToast();

  const [listName, setListName] = useState<string>(list.label);
  const [status, setStatus] = useState<FormStatus>({ state: "init" });

  // TODO: apply use-react-form later
  useEffect(() => {
    const trimedListName = listName.trim();
    if (trimedListName.length === 0) {
      setStatus({ state: "init" });
    } else if (trimedListName.length > constants.maxListNameLength)
      setStatus({
        state: "error",
        message: getMaxLengthError(trimedListName.length, "list_name"),
      });
    else if (
      formatSlugName(listName) !== list.value &&
      isContractListExist(listName)
    )
      setStatus({ state: "error", message: "Already existed" });
    else setStatus({ state: "success" });
  }, [
    constants.maxListNameLength,
    getMaxLengthError,
    isContractListExist,
    list.value,
    listName,
  ]);

  const handleSave = () => {
    track(AmpEvent.LIST_EDIT);
    // TODO: check list name and different toast status
    renameList(list.value, listName);
    toast({
      title: `Edit ${shortenName(list.label)} to ${shortenName(
        listName
      )} successfully`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon color="success.main" name="check-circle-solid" />,
    });
  };
  return (
    <ActionModal
      disabledMain={status.state !== "success"}
      icon="edit"
      mainAction={() => {
        handleSave();
        if (reroute)
          navigate({
            pathname: "/contract-lists/[slug]",
            query: { slug: formatSlugName(listName) },
            replace: true,
          });
      }}
      mainBtnTitle="Save"
      otherAction={() => setListName(list.label)}
      title="Edit list name"
      trigger={<MenuItem {...menuItemProps} as="button" />}
    >
      <TextInput
        label="List name"
        labelBgColor="gray.900"
        setInputState={setListName}
        status={status}
        value={listName}
        variant="fixed-floating"
      />
    </ActionModal>
  );
}
