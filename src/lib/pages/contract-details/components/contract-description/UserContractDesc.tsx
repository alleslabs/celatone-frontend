import { Box, Button, Flex, Text } from "@chakra-ui/react";
import router from "next/router";
import { useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text";

import { textLine } from "../../utils/textLine";
import { useContractDetail } from "lib/model/contract";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { ShowMoreButton } from "./ShowMoreButton";

export const UserContractDesc = () => {
  const contractAddress = getFirstQueryParam(router.query.contractAddress);
  const contractDetail = useContractDetail(contractAddress as ContractAddr);
  const [isUserContractShowMore, setIsUserContractShowMore] = useState(false);

  const [
    userUserContractRef,
    {
      noClamp: noUserDescClamp,
      clampedText: userContractDesc,
      key: userContractKey,
    },
  ] = useClampText({
    text: contractDetail?.contractInfo
      ? contractDetail?.contractInfo?.description || "No contract description"
      : "Save contract to lists to add your own contract description ...",
    ellipsis: "...",
    lines: textLine(
      contractDetail?.publicInfo?.description,
      isUserContractShowMore
    ),
  });

  // TODO - Wire up Edit button
  const renderEditContractButton = () => {
    if (contractDetail?.contractInfo?.description) {
      return (
        <Button
          size="xs"
          color="primary.main"
          variant="none"
          leftIcon={<RiPencilFill />}
        >
          Edit
        </Button>
      );
    }
    return (
      <Button
        size="xs"
        color="primary.main"
        variant="none"
        leftIcon={<RiPencilFill />}
      >
        Add Description
      </Button>
    );
  };
  return (
    <Flex
      direction="column"
      bg="gray.900"
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
        <Box
          display="none"
          _groupHover={
            contractDetail?.contractInfo ? { display: "flex" } : undefined
          }
        >
          {renderEditContractButton()}
        </Box>
      </Flex>
      <Text
        variant="body2"
        ref={userUserContractRef as React.MutableRefObject<HTMLInputElement>}
        key={userContractKey}
      >
        <Linkify>
          {isUserContractShowMore
            ? contractDetail?.contractInfo?.description
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
