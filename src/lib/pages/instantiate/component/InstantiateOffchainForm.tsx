import { Text, Flex, Heading, Button } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import type { Option } from "lib/components/forms";
import { OffChainForm } from "lib/components/OffChainForm";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { useContractStore } from "lib/hooks";
import { useUserKey } from "lib/hooks/useUserKey";
import type { ContractAddr } from "lib/types";

interface InstantiateOffChainFormProps {
  title?: string;
  subtitle?: string;
  cta?: boolean;
  contractAddress: ContractAddr;
  contractLabel: string;
}

export const InstantiateOffChainForm = observer(
  ({
    title,
    subtitle,
    cta = true,
    contractAddress,
    contractLabel,
  }: InstantiateOffChainFormProps) => {
    const { address = "" } = useWallet();
    const router = useRouter();
    const { updateContractInfo } = useContractStore();
    const userKey = useUserKey();

    const {
      control,
      setValue,
      watch,
      handleSubmit,
      formState: { errors },
    } = useForm<OffchainDetail>({
      defaultValues: {
        name: "",
        description: "",
        tags: [],
        lists: [],
      },
      mode: "all",
    });

    const offchainState: OffchainDetail = {
      name: watch("name"),
      description: watch("description"),
      tags: watch("tags"),
      lists: watch("lists"),
    };
    const setTagsValue = (selectedOptions: string[]) => {
      setValue("tags", selectedOptions);
    };
    const setContractListsValue = (selectedOptions: Option[]) => {
      setValue("lists", selectedOptions);
    };

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
          data.lists
        );
        router.push("/contract-list/instantiated-by-me");
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
        <OffChainForm
          nameField="name"
          descriptionField="description"
          state={offchainState}
          control={control}
          setTagsValue={setTagsValue}
          setContractListsValue={setContractListsValue}
          errors={errors}
        />
        {cta && (
          <Flex gap={6} w="full" mt={4} justifyContent="center">
            <Button
              w="128px"
              onClick={saveContract}
              isDisabled={!!Object.keys(errors).length}
            >
              Save
            </Button>
            <Button
              w="128px"
              variant="outline-gray"
              onClick={() => router.push("/contract-list/instantiated-by-me")}
            >
              Skip
            </Button>
          </Flex>
        )}
      </Flex>
    );
  }
);
