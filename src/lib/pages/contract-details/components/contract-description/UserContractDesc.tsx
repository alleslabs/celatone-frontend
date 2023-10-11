import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import type { ContractData } from "../../types";
import { ShowMoreButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { EditContractDetailsModal } from "lib/components/modal";

interface UserContractDescProps {
  contractDetail: ContractData["contractDetail"];
  contractLocalInfo: ContractData["contractLocalInfo"];
  publicProject: ContractData["publicProject"];
}
export const UserContractDesc = ({
  contractDetail,
  contractLocalInfo,
  publicProject,
}: UserContractDescProps) => {
  const [showMore, setShowMore] = useState(false);

  const description = contractLocalInfo?.description;

  const [ref, { noClamp, clampedText, key }] = useClampText({
    text: description || "No Contract description",
    ellipsis: "...",
    lines: publicProject.publicInfo?.description ? 4 : 2,
  });

  const renderEditContractButton = () => {
    if (!contractDetail) return null;
    return (
      <EditContractDetailsModal
        contractLocalInfo={{
          contractAddress: contractDetail.contractAddress,
          instantiator: contractDetail.instantiator,
          label: contractDetail.label,
          name: contractLocalInfo?.name,
          description,
          tags: contractLocalInfo?.tags,
          lists: contractLocalInfo?.lists,
        }}
        triggerElement={
          <Button
            size="xs"
            color="secondary.main"
            variant="ghost-secondary"
            leftIcon={<CustomIcon name="edit" boxSize={3} />}
          >
            {description ? "Edit" : "Add Description"}
          </Button>
        }
      />
    );
  };

  const displayDescription = useMemo(() => {
    if (!description) {
      return "No Contract Description";
    }
    return showMore ? description : clampedText;
  }, [clampedText, description, showMore]);

  return (
    <Flex
      direction="column"
      bg="gray.900"
      maxW="100%"
      borderRadius="8px"
      p={4}
      flex="1"
      role="group"
    >
      <Flex justify="space-between" align="center" h="32px">
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
        <Linkify>{displayDescription}</Linkify>
      </Text>

      {!noClamp && description && (
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
