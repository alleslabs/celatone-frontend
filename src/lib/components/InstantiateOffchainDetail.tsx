import { Text, Flex, Heading, Button } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import type { FormStatus, Option } from "lib/components/forms";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import {
  getMaxContractDescriptionLengthError,
  getMaxContractNameLengthError,
  MAX_CONTRACT_DESCRIPTION_LENGTH,
  MAX_CONTRACT_NAME_LENGTH,
} from "lib/data";
import { useContractStore } from "lib/hooks";
import { useUserKey } from "lib/hooks/useUserKey";

import { ListSelection } from "./forms/ListSelection";
import { TagSelection } from "./forms/TagSelection";

interface InstantiateOffChainFormProps {
  title?: string;
  subtitle?: string;
  cta?: boolean;
  contractAddress: string;
  contractLabel: string;
}

export const InstantiateOffChainDetail = observer(
  ({
    title,
    subtitle,
    cta = true,
    contractAddress,
    contractLabel,
  }: InstantiateOffChainFormProps) => {
    const { address = "" } = useWallet();
    const router = useRouter();
    const { updateContractInfo, getAllTags } = useContractStore();
    const userKey = useUserKey();

    const { control, setValue, watch, handleSubmit } = useForm({
      defaultValues: {
        name: "",
        description: "",
        tags: [] as string[],
        contractLists: [] as Option[],
      },
    });
    const nameState = watch("name");
    const descriptionState = watch("description");
    const tagsState = watch("tags");
    const contractListState = watch("contractLists");

    const [nameStatus, setNameStatus] = useState<FormStatus>({ state: "init" });
    const [descriptionStatus, setDescriptionStatus] = useState<FormStatus>({
      state: "init",
    });

    useEffect(() => {
      const trimedName = nameState.trim();
      if (trimedName.length === 0) {
        setNameStatus({ state: "init" });
      } else if (trimedName.length > MAX_CONTRACT_NAME_LENGTH)
        setNameStatus({
          state: "error",
          message: getMaxContractNameLengthError(trimedName.length),
        });
      else setNameStatus({ state: "success" });
    }, [nameState]);

    useEffect(() => {
      const trimedDescription = descriptionState.trim();
      if (trimedDescription.length === 0) {
        setDescriptionStatus({ state: "init" });
      } else if (trimedDescription.length > MAX_CONTRACT_DESCRIPTION_LENGTH)
        setDescriptionStatus({
          state: "error",
          message: getMaxContractDescriptionLengthError(
            trimedDescription.length
          ),
        });
      else setDescriptionStatus({ state: "success" });
    }, [descriptionState]);

    const saveContract = () => {
      handleSubmit((data) => {
        updateContractInfo(
          userKey,
          contractAddress,
          address,
          contractLabel,
          new Date(),
          data.name,
          data.description,
          data.tags,
          data.contractLists
        );
        router.push("/contracts/instantiated-by-me");
      })();
    };

    return (
      <Flex direction="column" gap={8}>
        {title && subtitle && (
          <Flex direction="column" gap={1}>
            <Heading as="h6" variant="h6" color="text.main">
              {title}
            </Heading>
            <Text color="text.dark" variant="body2">
              {subtitle}
            </Text>
          </Flex>
        )}
        <ControllerInput
          name="name"
          control={control}
          label="Name"
          helperText="Set name for your contract"
          variant="floating"
          status={nameStatus}
        />
        <ControllerTextarea
          name="description"
          control={control}
          label="Description"
          helperText="Help understanding what this contract do and how it works"
          variant="floating"
          status={descriptionStatus}
        />
        <TagSelection
          options={getAllTags(userKey)}
          result={tagsState}
          placeholder="Tags"
          helperText="Add tag to organize and manage your contracts"
          setResult={(selectedOptions: string[]) => {
            setValue("tags", selectedOptions);
          }}
          labelBgColor="background.main"
        />
        <ListSelection
          result={contractListState}
          placeholder="Add to contract lists"
          helperText="Grouping your contracts by adding to your existing list or create
              a new list"
          setResult={(selectedOptions: Option[]) => {
            setValue("contractLists", selectedOptions);
          }}
          labelBgColor="background.main"
        />
        {cta && (
          <Flex gap={6} w="full" mt={4} justifyContent="center">
            <Button
              w="128px"
              onClick={saveContract}
              isDisabled={
                nameState.trim().length > MAX_CONTRACT_NAME_LENGTH ||
                descriptionState.trim().length > MAX_CONTRACT_DESCRIPTION_LENGTH
              }
            >
              Save
            </Button>
            <Button
              w="128px"
              variant="outline-gray"
              onClick={() => router.push("/contracts/instantiated-by-me")}
            >
              Skip
            </Button>
          </Flex>
        )}
      </Flex>
    );
  }
);
