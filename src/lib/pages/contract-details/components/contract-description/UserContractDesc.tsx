import { Button, Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { ShowMoreButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { EditContractDetailsModal } from "lib/components/modal";
import type { Contract } from "lib/services/types";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { Nullable, Option, PublicContractInfo } from "lib/types";

interface UserContractDescProps {
  contract: Contract;
  contractLocalInfo: Option<ContractLocalInfo>;
  publicInfo: Nullable<PublicContractInfo>;
}
export const UserContractDesc = ({
  contract,
  contractLocalInfo,
  publicInfo,
}: UserContractDescProps) => {
  const [showMore, setShowMore] = useState(false);

  const description = contractLocalInfo?.description;

  const [ref, { clampedText, key, noClamp }] = useClampText({
    ellipsis: "...",
    lines: publicInfo?.description ? 4 : 2,
    text: description || "No Contract description",
  });

  const displayDescription = useMemo(() => {
    if (!description) {
      return "No Contract Description";
    }
    return showMore ? description : clampedText;
  }, [clampedText, description, showMore]);

  return (
    <Flex
      bg="gray.900"
      flex={1}
      maxW="100%"
      p={4}
      borderRadius="8px"
      direction="column"
      role="group"
    >
      <Flex align="center" h="32px" justify="space-between">
        <Text variant="body2" color="text.dark" fontWeight={500}>
          Your Contract Description
        </Text>
        <EditContractDetailsModal
          triggerElement={
            <Button
              display="none"
              size="xs"
              variant="ghost-primary"
              _groupHover={{ display: "flex" }}
              leftIcon={<CustomIcon name="edit" boxSize={3} />}
            >
              {description ? "Edit" : "Add Description"}
            </Button>
          }
          contractLocalInfo={{
            contractAddress: contract.address,
            description,
            instantiator: contract.instantiator,
            label: contract.label,
            lists: contractLocalInfo?.lists,
            name: contractLocalInfo?.name,
            tags: contractLocalInfo?.tags,
          }}
        />
      </Flex>
      <Text
        key={key}
        variant="body2"
        whiteSpace="pre-wrap"
        ref={ref as React.MutableRefObject<HTMLParagraphElement>}
      >
        <Linkify>{displayDescription}</Linkify>
      </Text>

      {!noClamp && description && (
        <ShowMoreButton
          setToggleShowMore={() => setShowMore(!showMore)}
          showLessText="View Less Description"
          showMoreText="View Full Description"
          toggleShowMore={showMore}
        />
      )}
    </Flex>
  );
};
