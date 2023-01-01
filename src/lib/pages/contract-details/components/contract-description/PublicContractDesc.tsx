import { Flex, Icon, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { BiWorld } from "react-icons/bi";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import type { ContractDetail } from "lib/model/contract";
import { textLine } from "lib/utils";

import { ShowMoreButton } from "./ShowMoreButton";

interface PublicContractDescProps {
  contractDetail: ContractDetail;
}
export const PublicContractDesc = ({
  contractDetail,
}: PublicContractDescProps) => {
  const [showMore, setShowMore] = useState(false);

  const description = useMemo(
    () => contractDetail.publicInfo?.description,
    [contractDetail.publicInfo?.description]
  );

  const [ref, { noClamp, clampedText, key }] = useClampText({
    text: description || "",
    ellipsis: "...",
    lines: textLine(!contractDetail.contractInfo?.description, showMore),
  });

  if (!description) return null;

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
          ref={ref as React.MutableRefObject<HTMLParagraphElement>}
          key={key}
        >
          {showMore ? description : clampedText}
        </Text>
      </Linkify>
      {!noClamp && (
        <ShowMoreButton
          toggleShowMore={showMore}
          setToggleShowMore={() => setShowMore(!showMore)}
        />
      )}
    </Flex>
  );
};
