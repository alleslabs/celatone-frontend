import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { ShowMoreButton } from "lib/components/button";
import { EditContractDetailsModal } from "lib/components/modal";
import type { ContractData } from "lib/types";
import { textLine } from "lib/utils";

interface UserContractDescProps {
  contractData: ContractData;
}
export const UserContractDesc = ({ contractData }: UserContractDescProps) => {
  const [showMore, setShowMore] = useState(false);

  const [ref, { noClamp, clampedText, key }] = useClampText({
    text:
      contractData.contractLocalInfo?.description || "No Contract description",
    ellipsis: "...",
    lines: textLine(
      !contractData.publicProject.publicInfo?.description,
      showMore
    ),
  });

  const renderEditContractButton = () => {
    if (!contractData.instantiateInfo) return null;
    return (
      <EditContractDetailsModal
        contractLocalInfo={{
          contractAddress: contractData.instantiateInfo.contractAddress,
          instantiator: contractData.instantiateInfo.instantiator,
          label: contractData.instantiateInfo.label,
          name: contractData.contractLocalInfo?.name,
          description: contractData.contractLocalInfo?.description,
          tags: contractData.contractLocalInfo?.tags,
          lists: contractData.contractLocalInfo?.lists,
        }}
        triggerElement={
          <Button
            size="xs"
            color="lilac.main"
            variant="ghost-primary"
            leftIcon={<RiPencilFill />}
          >
            {contractData.contractLocalInfo?.description
              ? "Edit"
              : "Add Description"}
          </Button>
        }
      />
    );
  };

  const displayDescription = () => {
    if (!contractData.contractLocalInfo?.description) {
      return "No Contract Description";
    }
    return showMore ? contractData.contractLocalInfo.description : clampedText;
  };

  return (
    <Flex
      direction="column"
      bg="pebble.900"
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
        <Linkify>{displayDescription()}</Linkify>
      </Text>

      {!noClamp && contractData.contractLocalInfo?.description && (
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
