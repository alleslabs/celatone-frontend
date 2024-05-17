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
  publicInfo: Nullable<PublicContractInfo>;
  contract: Contract;
  contractLocalInfo: Option<ContractLocalInfo>;
}
export const UserContractDesc = ({
  publicInfo,
  contract,
  contractLocalInfo,
}: UserContractDescProps) => {
  const [showMore, setShowMore] = useState(false);

  const description = contractLocalInfo?.description;

  const [ref, { noClamp, clampedText, key }] = useClampText({
    text: description || "No Contract description",
    ellipsis: "...",
    lines: publicInfo?.description ? 4 : 2,
  });

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
        <EditContractDetailsModal
          contractLocalInfo={{
            contractAddress: contract.address,
            instantiator: contract.instantiator,
            label: contract.label,
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
              display="none"
              _groupHover={{ display: "flex" }}
            >
              {description ? "Edit" : "Add Description"}
            </Button>
          }
        />
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
