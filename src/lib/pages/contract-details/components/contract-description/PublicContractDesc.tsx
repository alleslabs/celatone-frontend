import { Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { ShowMoreButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import type { ContractData } from "lib/types";
import { textLine } from "lib/utils";

interface PublicContractDescProps {
  contractData: ContractData;
}
export const PublicContractDesc = ({
  contractData,
}: PublicContractDescProps) => {
  const [showMore, setShowMore] = useState(false);

  const description = useMemo(
    () =>
      contractData.publicProject.publicInfo?.description ||
      "No public contract description",
    [contractData.publicProject.publicInfo?.description]
  );

  const [ref, { noClamp, clampedText, key }] = useClampText({
    text: description,
    ellipsis: "...",
    lines: textLine(!contractData.contractLocalInfo?.description, showMore),
  });

  return (
    <Flex
      direction="column"
      bg="pebble.900"
      maxW="100%"
      borderRadius="8px"
      p={4}
      my={6}
      flex="1"
    >
      <Flex gap={2} alignItems="center" h="32px" mb="1">
        <CustomIcon name="website" />
        <Text variant="body2" fontWeight={500} color="text.dark" mt="1px">
          Public Contract Description
        </Text>
      </Flex>
      <Text
        variant="body2"
        whiteSpace="pre-wrap"
        ref={ref as React.MutableRefObject<HTMLParagraphElement>}
        key={key}
      >
        <Linkify>{showMore ? description : clampedText}</Linkify>
      </Text>
      {!noClamp && (
        <ShowMoreButton
          showMoreText="View Full Description"
          showLessText="View Less Description"
          toggleShowMore={showMore}
          setToggleShowMore={() => setShowMore(!showMore)}
        />
      )}
    </Flex>
  );
};
