import { Flex, Icon, Text } from "@chakra-ui/react";
import router from "next/router";
import { useState } from "react";
import { BiWorld } from "react-icons/bi";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { textLine } from "../../utils/textLine";
import { useContractDetail } from "lib/model/contract";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { ShowMoreButton } from "./ShowMoreButton";

export const PublicContractDesc = () => {
  const contractAddress = getFirstQueryParam(router.query.contractAddress);
  const contractDetail = useContractDetail(contractAddress as ContractAddr);

  const [isPublicContractShowMore, setIsPublicContractShowMore] =
    useState(false);

  const [
    publicContractRef,
    {
      noClamp: noPublicDescClamp,
      clampedText: publicContractDesc,
      key: publicContractKey,
    },
  ] = useClampText({
    text: contractDetail?.publicInfo?.description || "",
    ellipsis: "...",
    lines: textLine(
      contractDetail?.contractInfo?.description,
      isPublicContractShowMore
    ),
  });

  return (
    <Flex
      direction="column"
      bg="gray.900"
      borderRadius="8px"
      p={4}
      my={6}
      flex="1"
    >
      <Flex gap={2} align="center" h="30px">
        <Icon as={BiWorld} color="text.dark" />
        <Text variant="body2" fontWeight={500} color="text.dark">
          Public Contract Description
        </Text>
      </Flex>
      <Linkify>
        <Text
          variant="body2"
          color="text.dark"
          ref={publicContractRef as React.MutableRefObject<HTMLInputElement>}
          key={publicContractKey}
        >
          {isPublicContractShowMore
            ? contractDetail?.publicInfo?.description
            : publicContractDesc}
        </Text>
      </Linkify>
      {!noPublicDescClamp && (
        <ShowMoreButton
          toggleShowMore={isPublicContractShowMore}
          setToggleShowMore={() =>
            setIsPublicContractShowMore(!isPublicContractShowMore)
          }
        />
      )}
    </Flex>
  );
  //   }
};
