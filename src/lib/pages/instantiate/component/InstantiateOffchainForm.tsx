import type { OffchainDetail } from "lib/components/OffChainForm";
import type { BechAddr20, BechAddr32, LVPair } from "lib/types";

import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { OffChainForm } from "lib/components/OffChainForm";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore } from "lib/providers/store";
import { formatSlugName } from "lib/utils";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";

interface InstantiateOffChainFormProps {
  title?: string;
  subtitle?: string;
  cta?: boolean;
  contractAddress: BechAddr32;
  contractLabel: string;
  codeId: number;
  instantiator: BechAddr20;
}

export const InstantiateOffChainForm = observer(
  ({
    title,
    subtitle,
    cta = true,
    contractAddress,
    contractLabel,
    codeId,
    instantiator,
  }: InstantiateOffChainFormProps) => {
    const navigate = useInternalNavigate();
    const { updateContractLocalInfo } = useContractStore();
    const instantiatedListSlug = formatSlugName(INSTANTIATED_LIST_NAME);

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
    const setTagsValue = (selectedTags: string[]) => {
      setValue("tags", selectedTags);
    };
    const setContractListsValue = (selectedLists: LVPair[]) => {
      setValue("lists", selectedLists);
    };

    const saveContract = () => {
      handleSubmit((data) => {
        track(AmpEvent.CONTRACT_SAVE_AFTER_INIT);
        updateContractLocalInfo(
          contractAddress,
          contractLabel,
          codeId,
          instantiator,
          data.name,
          data.description,
          data.tags,
          data.lists
        );
        navigate({
          pathname: "/contract-lists/[slug]",
          query: { slug: instantiatedListSlug },
        });
      })();
    };

    return (
      <Flex direction="column" gap={8} width="full">
        {title && subtitle && (
          <Flex direction="column" gap={1}>
            <Heading as="h6" variant="h6">
              {title}
            </Heading>
            <Text color="text.dark" variant="body2">
              {subtitle}
            </Text>
          </Flex>
        )}
        <OffChainForm<OffchainDetail>
          contractLabel={contractLabel}
          control={control}
          errors={errors}
          setContractListsValue={setContractListsValue}
          setTagsValue={setTagsValue}
          state={offchainState}
        />
        {cta && (
          <Flex gap={6} justifyContent="center" mt={4} w="full">
            <Button
              isDisabled={!!Object.keys(errors).length}
              w="128px"
              onClick={saveContract}
            >
              Save
            </Button>
            <Button
              variant="outline-gray"
              w="128px"
              onClick={() =>
                navigate({
                  pathname: "/contract-lists/[slug]",
                  query: { slug: instantiatedListSlug },
                })
              }
            >
              Skip
            </Button>
          </Flex>
        )}
      </Flex>
    );
  }
);
