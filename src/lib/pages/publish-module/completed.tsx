import { Flex, Heading, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxReceiptRender } from "lib/components/tx";
import WasmPageContainer from "lib/components/WasmPageContainer";

import type { PublishCompleteState } from ".";
import { ModulePublishCard } from "./components/ModulePublishCard";

export const PublishCompleted = ({
  txHash,
  formattedFee,
  upgradePolicy,
  modules,
}: PublishCompleteState) => {
  return (
    <WasmPageContainer>
      <CustomIcon boxSize={8} color="success.main" name="check-circle-solid" />
      <Heading as="h4" variant="h4" mt={4} mb={2}>
        {`<${modules.length}>`} Modules published!
      </Heading>
      <Text variant="body2" color="text.dark">
        Your .mv files are uploaded and published as modules.
      </Text>
      <TxReceiptRender
        receipts={[
          {
            title: "Tx Hash",
            html: <ExplorerLink type="tx_hash" value={txHash} />,
          },
          {
            title: "Tx Fee",
            value: formattedFee,
          },
          {
            title: "Upgrade Policy",
            value: capitalize(upgradePolicy),
          },
        ]}
        variant="full"
        my={12}
      />
      <Flex direction="column" gap={6} w="full">
        <Heading as="h6" variant="h6">
          Published {`<${modules.length}>`} modules
        </Heading>
        {modules.map((module) => (
          <ModulePublishCard key={module.id} module={module} />
        ))}
      </Flex>
    </WasmPageContainer>
  );
};
