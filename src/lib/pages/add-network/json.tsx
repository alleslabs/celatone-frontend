import { Flex } from "@chakra-ui/react";

import ActionPageContainer from "lib/components/ActionPageContainer";
import {
  CustomNetworkFooterCtaBody,
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";

export const ImportJson = () => {
  const leftButtonProps = {
    label: "Cancel",
    action: () => {},
    variant: "outline-secondary",
  };

  const rightButtonProps = {
    label: "Import new Minitia",
    action: () => {},
    variant: "primary",
  };

  return (
    <ActionPageContainer>
      <CustomNetworkPageHeader
        title="Add Custom Minitia"
        subtitle="Import JSON"
        hasAlert={false}
      />
      <Flex direction="column" my={12} gap={6} align="flex-start" w="full">
        <CustomNetworkSubheader
          title="Upload your .JSON File"
          subtitle="The uploading JSON file must be in the supported format for InitiaScan only"
        />
        <Flex bg="teal" minH={24} w="full">
          drag file here
        </Flex>
        <Flex w="full">
          <CustomNetworkFooterCtaBody
            leftButtonProps={leftButtonProps}
            rightButtonProps={rightButtonProps}
          />
        </Flex>
      </Flex>
    </ActionPageContainer>
  );
};
