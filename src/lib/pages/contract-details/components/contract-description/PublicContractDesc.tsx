import { Flex, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BiWorld } from "react-icons/bi";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { textLine } from "../../utils/textLine";
import type { ContractDetail } from "lib/model/contract";

import { ShowMoreButton } from "./ShowMoreButton";

interface PublicContractDescProps {
  contractDetail: ContractDetail;
}
export const PublicContractDesc = ({
  contractDetail,
}: PublicContractDescProps) => {
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
    text: contractDetail.publicInfo?.description || "",
    ellipsis: "...",
    lines: textLine(
      contractDetail.contractInfo?.description,
      isPublicContractShowMore
    ),
  });

  return (
    <Flex
      direction="column"
      bg="gray.900"
      maxW="100%"
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
          whiteSpace="break-spaces"
          ref={publicContractRef as React.MutableRefObject<HTMLInputElement>}
          key={publicContractKey}
        >
          {isPublicContractShowMore
            ? contractDetail.publicInfo?.description
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
