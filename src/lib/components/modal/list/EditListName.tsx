import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, useToast, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdAddCircleOutline, MdCheckCircle } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { TextInput } from "lib/components/forms/TextInput";
import { ActionModal } from "lib/components/modal/ActionModal";
import { getMaxListNameLengthError, MAX_LIST_NAME_LENGTH } from "lib/data";
import { useUserKey } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
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
  const userKey = useUserKey();
  const { renameList, isContractListExist } = useContractStore();
  const navigate = useInternalNavigate();

  const [listName, setListName] = useState<string>(list.label);
  const [status, setStatus] = useState<FormStatus>({ state: "init" });

  // TODO: apply use-react-form later
  useEffect(() => {
    const trimedListName = listName.trim();
    if (trimedListName.length === 0) {
      setStatus({ state: "init" });
    } else if (trimedListName.length > MAX_LIST_NAME_LENGTH)
      setStatus({
        state: "error",
        message: getMaxListNameLengthError(trimedListName.length),
      });
    else if (
      formatSlugName(listName) !== list.value &&
      isContractListExist(userKey, listName)
    )
      setStatus({ state: "error", message: "Already existed" });
    else setStatus({ state: "success" });
  }, [isContractListExist, list.value, listName, userKey]);

  const toast = useToast();
  const handleSave = () => {
    AmpTrack(AmpEvent.LIST_EDIT);
    // TODO: check list name and different toast status
    renameList(userKey, list.value, listName);
    toast({
      title: `Edit ${shortenName(list.label)} to ${shortenName(
        listName
      )} successfully`,
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
    <ActionModal
      title="Edit list name"
      icon={MdAddCircleOutline}
      trigger={<MenuItem {...menuItemProps} />}
      mainBtnTitle="Save"
      mainAction={() => {
        handleSave();
        if (reroute)
          navigate({
            pathname: "/contract-list/[slug]",
            query: { slug: formatSlugName(listName) },
            replace: true,
          });
      }}
      disabledMain={status.state !== "success"}
      otherAction={() => setListName(list.label)}
    >
      <TextInput
        variant="floating"
        value={listName}
        setInputState={setListName}
        labelBgColor="pebble.900"
        status={status}
        label="List Name"
      />
    </ActionModal>
  );
}
