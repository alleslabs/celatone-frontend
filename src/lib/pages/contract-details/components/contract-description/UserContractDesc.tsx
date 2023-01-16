import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { ShowMoreButton } from "lib/components/button";
import { EditContractDetails } from "lib/components/modal";
import type { ContractData } from "lib/model/contract";
import { textLine } from "lib/utils";

interface UserContractDescProps {
  contractData: ContractData;
}
export const UserContractDesc = ({ contractData }: UserContractDescProps) => {
  const [showMore, setShowMore] = useState(false);

  const description = useMemo(
    () => contractData.contractInfo?.description,
    [contractData.contractInfo?.description]
  );

  const [ref, { noClamp, clampedText, key }] = useClampText({
    text: description || "No contract description",
    ellipsis: "...",
    lines: textLine(!contractData.publicInfo?.description, showMore),
  });

  const renderEditContractButton = () => {
    if (!contractData.instantiateInfo) return null;
    return (
      <EditContractDetails
        contractInfo={{
          contractAddress: contractData.instantiateInfo.contractAddress,
          instantiator: contractData.instantiateInfo.instantiator,
          label: contractData.instantiateInfo.label,
          created: contractData.instantiateInfo.createdTime,
          name: contractData.contractInfo?.name,
          description,
          tags: contractData.contractInfo?.tags,
          lists: contractData.contractInfo?.lists,
        }}
        triggerElement={
          <Button
            size="xs"
            color="primary.main"
            variant="none"
            leftIcon={<RiPencilFill />}
          >
            {description ? "Edit" : "Add Description"}
          </Button>
        }
      />
    );
  };

  return (
    <Flex
      direction="column"
      bg="gray.900"
      maxW="100%"
      borderRadius="8px"
      p={4}
      my={6}
      flex="1"
      role="group"
    >
      <Flex justify="space-between" align="center" h="30px">
        <Text variant="body2" fontWeight={500} color="text.dark">
          Your Contract Description
        </Text>
        <Box display="none" _groupHover={{ display: "flex" }}>
          {renderEditContractButton()}
        </Box>
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
