import type { Contract, ContractApi } from "lib/services/types";
import type { CodeLocalInfo } from "lib/stores/code";
import type { Nullable, Nullish, Option, WasmVerifyInfo } from "lib/types";

import { Box, chakra, Divider, Flex, Text } from "@chakra-ui/react";
import {
  useCurrentChain,
  useGetAddressType,
  useMobile,
  useTierConfig,
  useIsApiChain,
} from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { WasmVerifySubmitModal } from "lib/components/modal";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { WasmVerifyStatus } from "lib/types";
import {
  dateFromNow,
  formatUTC,
  getCw2Info,
  getWasmVerifyStatus,
} from "lib/utils";
import { getAddressTypeText } from "lib/utils/address";
interface InstantiateInfoProps {
  contract: Contract;
  contractApi: Nullable<ContractApi>;
  codeLocalInfo: Option<CodeLocalInfo>;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    gap: 6,
    w: "250px",
  },
});

const PortIdRender = ({ portId }: { portId: string }) => {
  const charArray = portId.match(/.{1,28}/g);

  return (
    <Box
      className="copier-wrapper"
      fontSize="14px"
      transition="all 0.25s ease-in-out"
    >
      {charArray?.map((line, idx) =>
        idx === charArray.length - 1 ? (
          <Flex key={line} align="center">
            {line}
            <Copier display="none" type="ibc_port" value={portId} />
          </Flex>
        ) : (
          line
        )
      )}
    </Box>
  );
};

const InitRender = ({
  initTxHash,
  initProposalTitle,
  initProposalId,
  createdHeight,
}: Contract) => {
  if (initTxHash) {
    return (
      <LabelText label="Instantiate Transaction">
        <ExplorerLink
          fixedHeight
          showCopyOnHover
          type="tx_hash"
          value={initTxHash.toUpperCase()}
        />
      </LabelText>
    );
  }

  if (initProposalTitle && initProposalId) {
    return (
      <LabelText
        helperText1={initProposalTitle}
        label="Instantiate Proposal ID"
      >
        <ExplorerLink
          fixedHeight
          showCopyOnHover
          type="proposal_id"
          value={initProposalId.toString()}
        />
      </LabelText>
    );
  }

  return createdHeight === 0 ? (
    <LabelText label="Created by">
      <Text variant="body2">Genesis</Text>
    </LabelText>
  ) : (
    <LabelText label="Instantiate Transaction">
      <Text variant="body2">N/A</Text>
    </LabelText>
  );
};

export const InstantiateInfo = ({
  contract,
  contractApi,
  codeLocalInfo,
  wasmVerifyInfo,
}: InstantiateInfoProps) => {
  const isApiChain = useIsApiChain({
    shouldRedirect: false,
  });
  const { isFullTier } = useTierConfig();
  const isMobile = useMobile();
  const getAddressType = useGetAddressType();
  const { chainId } = useCurrentChain();

  const instantiatorType = getAddressType(contract.instantiator);
  const adminType = getAddressType(contract.admin ?? undefined);
  const cw2 = getCw2Info(contract.cw2Contract, contract.cw2Version);
  const wasmVerifyStatus = getWasmVerifyStatus(wasmVerifyInfo);

  return (
    <Container h="fit-content" w={{ base: "full", md: "auto" }}>
      <Flex direction={{ base: "row", md: "column" }} gap={{ base: 4, md: 6 }}>
        <LabelText flex={1} label="Network">
          {chainId}
        </LabelText>
        <LabelText flex={1} helperText1={codeLocalInfo?.name} label="From Code">
          <Flex direction="column">
            <Flex gap={1}>
              <ExplorerLink
                fixedHeight
                showCopyOnHover
                type="code_id"
                value={contract.codeId.toString()}
              />
              <WasmVerifyBadge
                hasText
                linkedCodeId={contract.codeId}
                relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                status={wasmVerifyStatus}
              />
            </Flex>
            {!isMobile &&
              isApiChain &&
              wasmVerifyStatus !== WasmVerifyStatus.VERIFIED &&
              wasmVerifyStatus !== WasmVerifyStatus.IN_PROGRESS && (
                <Text color="text.dark" variant="body2">
                  Is this your code?{" "}
                  <WasmVerifySubmitModal
                    codeHash={contract.codeHash}
                    codeId={contract.codeId}
                    contractAddress={contract.address}
                    relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                    triggerElement={
                      <Text
                        _hover={{
                          textDecoration: "underline",
                          textDecorationColor: "primary.light",
                        }}
                        color="primary.main"
                        cursor="pointer"
                        transition="all 0.25s ease-in-out"
                      >
                        Verify Code
                      </Text>
                    }
                    wasmVerifyStatus={wasmVerifyStatus}
                  />
                </Text>
              )}
          </Flex>
        </LabelText>
      </Flex>
      <Flex direction={{ base: "row", md: "column" }} gap={{ base: 4, md: 6 }}>
        <LabelText flex={1} label="CW2 Info">
          {cw2 ? (
            <Text variant="body2" wordBreak="break-all">
              {cw2}
            </Text>
          ) : (
            <Text color="text.dark" variant="body2">
              No Info
            </Text>
          )}
        </LabelText>
        {contract.admin ? (
          <LabelText
            flex={1}
            helperText1={getAddressTypeText(adminType)}
            label="Admin Address"
          >
            <ExplorerLink
              fixedHeight
              showCopyOnHover
              type={adminType}
              value={contract.admin}
            />
          </LabelText>
        ) : (
          <LabelText flex={1} label="Admin Address">
            <Text color="text.dark" variant="body2">
              No Admin
            </Text>
          </LabelText>
        )}
      </Flex>
      <Divider border="1px solid" borderColor="gray.700" />
      <LabelText
        flex={1}
        helperText1={
          contract.createdTimestamp
            ? formatUTC(contract.createdTimestamp)
            : undefined
        }
        helperText2={
          contract.createdTimestamp
            ? dateFromNow(contract.createdTimestamp)
            : undefined
        }
        label="Instantiated Block Height"
      >
        {contract.createdHeight ? (
          <ExplorerLink
            fixedHeight
            showCopyOnHover
            type="block_height"
            value={contract.createdHeight.toString()}
          />
        ) : (
          "N/A"
        )}
      </LabelText>
      <Flex direction={{ base: "row", md: "column" }} gap={{ base: 1, md: 6 }}>
        <LabelText
          flex={1}
          helperText1={getAddressTypeText(instantiatorType)}
          label="Instantiated by"
        >
          <ExplorerLink
            fixedHeight
            showCopyOnHover
            type={instantiatorType}
            value={contract.instantiator}
          />
        </LabelText>
        {isFullTier && (
          <Flex flex={1}>
            <InitRender {...contract} />
          </Flex>
        )}
      </Flex>
      <Flex direction={{ base: "row", md: "column" }} gap={{ base: 1, md: 6 }}>
        {contractApi?.contract_info.ibc_port_id && (
          <LabelText label="IBC Port ID">
            <PortIdRender portId={contractApi.contract_info.ibc_port_id} />
          </LabelText>
        )}
      </Flex>
    </Container>
  );
};
