import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { textLine } from "../../utils/textLine";
import { EditContractDetails } from "lib/components/modal";
import type { ContractDetail } from "lib/model/contract";

import { ShowMoreButton } from "./ShowMoreButton";

interface UserContractDescProps {
  contractDetail: ContractDetail;
}
export const UserContractDesc = ({ contractDetail }: UserContractDescProps) => {
  const [isUserContractShowMore, setIsUserContractShowMore] = useState(false);

  const [
    userUserContractRef,
    {
      noClamp: noUserDescClamp,
      clampedText: userContractDesc,
      key: userContractKey,
    },
  ] = useClampText({
    text: contractDetail.contractInfo?.description || "No contract description",
    ellipsis: "...",
    lines: textLine(
      !contractDetail.publicInfo?.description,
      isUserContractShowMore
    ),
  });

  const renderEditContractButton = () => {
    if (!contractDetail.instantiateInfo) return null;
    return (
      <EditContractDetails
        contractInfo={{
          contractAddress: contractDetail.instantiateInfo.contractAddress,
          instantiator: contractDetail.instantiateInfo.instantiator,
          label: contractDetail.instantiateInfo.label,
          created: contractDetail.instantiateInfo.createdTime,
          name: contractDetail.contractInfo?.name,
          description: contractDetail.contractInfo?.description,
          tags: contractDetail.contractInfo?.tags,
          lists: contractDetail.contractInfo?.lists,
        }}
        triggerElement={
          <Button
            size="xs"
            color="primary.main"
            variant="none"
            leftIcon={<RiPencilFill />}
          >
            {contractDetail.contractInfo?.description
              ? "Edit"
              : "Add Description"}
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
        ref={userUserContractRef as React.MutableRefObject<HTMLInputElement>}
        key={userContractKey}
      >
        <Linkify>
          {isUserContractShowMore
            ? contractDetail.contractInfo?.description
            : userContractDesc}
        </Linkify>
      </Text>

      {!noUserDescClamp && (
        <ShowMoreButton
          toggleShowMore={isUserContractShowMore}
          setToggleShowMore={() =>
            setIsUserContractShowMore(!isUserContractShowMore)
          }
        />
      )}
    </Flex>
  );
};
