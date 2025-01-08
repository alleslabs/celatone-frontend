import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { OffChainForm } from "lib/components/OffChainForm";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore } from "lib/providers/store";
import type { BechAddr20, BechAddr32, LVPair } from "lib/types";
import { formatSlugName } from "lib/utils";

interface InstantiateOffChainFormProps {
  codeId: number;
  contractAddress: BechAddr32;
  contractLabel: string;
  cta?: boolean;
  instantiator: BechAddr20;
  subtitle?: string;
  title?: string;
}

export const InstantiateOffChainForm = observer(
  ({
    codeId,
    contractAddress,
    contractLabel,
    cta = true,
    instantiator,
    subtitle,
    title,
  }: InstantiateOffChainFormProps) => {
    const navigate = useInternalNavigate();
    const { updateContractLocalInfo } = useContractStore();
    const instantiatedListSlug = formatSlugName(INSTANTIATED_LIST_NAME);

    const {
      control,
      formState: { errors },
      handleSubmit,
      setValue,
      watch,
    } = useForm<OffchainDetail>({
      defaultValues: {
        description: "",
        lists: [],
        name: "",
        tags: [],
      },
      mode: "all",
    });

    const offchainState: OffchainDetail = {
      description: watch("description"),
      lists: watch("lists"),
      name: watch("name"),
      tags: watch("tags"),
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
      <Flex width="full" gap={8} direction="column">
        {title && subtitle && (
          <Flex gap={1} direction="column">
            <Heading as="h6" variant="h6">
              {title}
            </Heading>
            <Text variant="body2" color="text.dark">
              {subtitle}
            </Text>
          </Flex>
        )}
        <OffChainForm<OffchainDetail>
          setTagsValue={setTagsValue}
          state={offchainState}
          contractLabel={contractLabel}
          control={control}
          errors={errors}
          setContractListsValue={setContractListsValue}
        />
        {cta && (
          <Flex gap={6} mt={4} w="full" justifyContent="center">
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
