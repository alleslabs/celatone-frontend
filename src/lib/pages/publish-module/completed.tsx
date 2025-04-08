import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate, useIsApiChain } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { CelatoneSeo } from "lib/components/Seo";
import { TxReceiptRender } from "lib/components/tx";
import { feeFromStr } from "lib/utils";
import { capitalize } from "lodash";
import plur from "plur";

import type { PublishCompleteState } from ".";

import { ModulePublishCard } from "./components/ModulePublishCard";

interface PublishCompletedProps {
  publishTxInfo: PublishCompleteState;
  resetState: () => void;
}

export const PublishCompleted = ({
  publishTxInfo: { txHash, txFee, upgradePolicy, modules },
  resetState,
}: PublishCompletedProps) => {
  const navigate = useInternalNavigate();
  const isApiChain = useIsApiChain({ shouldRedirect: false });
  return (
    <ActionPageContainer>
      <CelatoneSeo pageName="Publish / Republish Modules" />
      <CustomIcon boxSize={8} color="success.main" name="check-circle-solid" />
      <Heading as="h4" mb={2} mt={4} variant="h4">
        {modules.length} {plur("module", modules.length)} published!
      </Heading>
      <Text color="text.dark" variant="body2">
        Your .mv files are uploaded and published as modules.
      </Text>
      <TxReceiptRender
        my={12}
        receipts={[
          {
            title: "Tx hash",
            html: <ExplorerLink type="tx_hash" value={txHash} />,
          },
          {
            title: "Tx fee",
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
          },
          {
            title: "Upgrade policy",
            value: capitalize(upgradePolicy),
          },
        ]}
        variant="full"
      />
      {isApiChain && (
        <Flex direction="column" gap={4} w="full" mb={12}>
          <Heading as="h6" variant="h6">
            Module verification
          </Heading>
          <Flex
            w="full"
            justifyContent="space-between"
            gap={6}
            alignItems="center"
          >
            <Text variant="body2" color="text.dark">
              Verifying modules enhances credibility by displaying a verified
              badge. Once verified, users will be able to access the
              module&apos;s source code on the details page.
            </Text>
            <Button
              variant="primary"
              minW={40}
              onClick={() =>
                navigate({
                  pathname: "/modules/verify",
                })
              }
            >
              Submit verification
            </Button>
          </Flex>
        </Flex>
      )}
      <Flex direction="column" gap={6} w="full">
        <Heading as="h6" variant="h6">
          Published {modules.length} {plur("module", modules.length)}
        </Heading>
        {modules.map((module, idx) => (
          <ModulePublishCard
            key={`${module.base64EncodedFile}-${idx.toString()}`}
            module={module}
          />
        ))}
      </Flex>
      <Button
        mt={6}
        rightIcon={<CustomIcon boxSize={3} name="chevron-right" />}
        variant="outline-primary"
        w="full"
        onClick={() => {
          track(AmpEvent.USE_PUBLISH_MORE_MODULE_BUTTON);
          resetState();
        }}
      >
        Publish more modules
      </Button>
    </ActionPageContainer>
  );
};
