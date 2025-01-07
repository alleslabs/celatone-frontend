import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useInternalNavigate } from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { TextInput } from "lib/components/forms/TextInput";
import { CustomIcon } from "lib/components/icon";
import { ActionModal } from "lib/components/modal/ActionModal";
import { useGetMaxLengthError } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import type { LVPair } from "lib/types";
import { formatSlugName, shortenName } from "lib/utils";

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
  const { isContractListExist, renameList } = useContractStore();
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
        message: getMaxLengthError(trimedListName.length, "list_name"),
        state: "error",
      });
    else if (
      formatSlugName(listName) !== list.value &&
      isContractListExist(listName)
    )
      setStatus({ message: "Already existed", state: "error" });
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
      duration: 5000,
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title: `Edit ${shortenName(list.label)} to ${shortenName(
        listName
      )} successfully`,
    });
  };
  return (
    <ActionModal
      disabledMain={status.state !== "success"}
      mainBtnTitle="Save"
      title="Edit list name"
      trigger={<MenuItem {...menuItemProps} as="button" />}
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
      otherAction={() => setListName(list.label)}
    >
      <TextInput
        label="List Name"
        setInputState={setListName}
        status={status}
        value={listName}
        variant="fixed-floating"
        labelBgColor="gray.900"
      />
    </ActionModal>
  );
}
