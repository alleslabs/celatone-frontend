import type { Contract } from "lib/services/types";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { Nullable, Option, PublicContractInfo } from "lib/types";

import { Button, Flex, Text } from "@chakra-ui/react";
import { ShowMoreButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import { EditContractDetailsModal } from "lib/components/modal";
import { useMemo, useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

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
    text: description || "No contract description",
  });

  const displayDescription = useMemo(() => {
    if (!description) {
      return "No contract description";
    }
    return showMore ? description : clampedText;
  }, [clampedText, description, showMore]);

  return (
    <Flex
      bg="gray.900"
      borderRadius="8px"
      direction="column"
      flex={1}
      maxW="100%"
      p={4}
      role="group"
    >
      <Flex align="center" h="32px" justify="space-between">
        <Text color="text.dark" fontWeight={500} variant="body2">
          Your contract description
        </Text>
        <EditContractDetailsModal
          contractLocalInfo={{
            contractAddress: contract.address,
            description,
            instantiator: contract.instantiator,
            label: contract.label,
            lists: contractLocalInfo?.lists,
            name: contractLocalInfo?.name,
            tags: contractLocalInfo?.tags,
          }}
          triggerElement={
            <Button
              _groupHover={{ display: "flex" }}
              display="none"
              leftIcon={<CustomIcon boxSize={3} name="edit" />}
              size="xs"
              variant="ghost-primary"
            >
              {description ? "Edit" : "Add description"}
            </Button>
          }
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
          showLessText="View less description"
          showMoreText="View full description"
          toggleShowMore={showMore}
        />
      )}
    </Flex>
  );
};
