import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useGetAddressType, useMobile, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { JsonSchemaModal } from "lib/components/json-schema";
import { PermissionChip } from "lib/components/PermissionChip";
import { ViewPermissionAddresses } from "lib/components/ViewPermissionAddresses";
import type { Code } from "lib/services/types";
import type { Option } from "lib/types";
import { dateFromNow, formatUTC, getAddressTypeText } from "lib/utils";

import { CodeInfoLabelText } from "./CodeInfoLabelText";

interface CodeInfoSectionProps {
  attached: boolean;
  chainId: string;
  code: Code;
  toJsonSchemaTab: () => void;
}

const getMethodSpecificRender = (
  proposal: Option<Code["proposal"]>,
  transaction: Option<Code["transaction"]>
): { methodRender: JSX.Element; storedBlockRender: JSX.Element } => {
  if (proposal) {
    const { created, height, id } = proposal;
    return {
      methodRender: (
        <CodeInfoLabelText label="Proposal ID">
          <ExplorerLink
            type="proposal_id"
            value={id.toString()}
            showCopyOnHover
          />
        </CodeInfoLabelText>
      ),
      storedBlockRender:
        height && created ? (
          <>
            <ExplorerLink
              type="block_height"
              value={height.toString()}
              showCopyOnHover
            />
            <Text variant="body3" color="text.dark">
              {formatUTC(created)}
            </Text>
            <Text variant="body3" color="text.dark">
              {dateFromNow(created)}
            </Text>
          </>
        ) : (
          <Text variant="body2">N/A</Text>
        ),
    };
  }

  if (transaction) {
    const { created, hash, height } = transaction;
    return {
      methodRender: (
        <CodeInfoLabelText label="Upload Transaction">
          <Flex minW="150px">
            <ExplorerLink type="tx_hash" value={hash} showCopyOnHover />
          </Flex>
        </CodeInfoLabelText>
      ),
      storedBlockRender:
        height && created ? (
          <>
            <ExplorerLink
              type="block_height"
              value={height.toString()}
              showCopyOnHover
            />
            <Text variant="body3" color="text.dark">
              {formatUTC(created)}
            </Text>
            <Text variant="body3" color="text.dark">
              {dateFromNow(created)}
            </Text>
          </>
        ) : (
          <Text variant="body3" color="text.dark">
            N/A
          </Text>
        ),
    };
  }

  /**
   * @todo Add genesis conditioning when the view table is available
   */
  return {
    methodRender: <CodeInfoLabelText label="Created on">N/A</CodeInfoLabelText>,
    storedBlockRender: <Text variant="body2">N/A</Text>,
  };
};

export const CodeInfoSection = ({
  attached,
  chainId,
  code,
  toJsonSchemaTab,
}: CodeInfoSectionProps) => {
  const { isFullTier } = useTierConfig();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const getAddressType = useGetAddressType();
  const {
    codeId,
    hash,
    instantiatePermission,
    permissionAddresses,
    proposal,
    transaction,
    uploader,
  } = code;

  const { methodRender, storedBlockRender } = getMethodSpecificRender(
    proposal,
    transaction
  );
  const uploaderType = getAddressType(uploader);
  const isMobile = useMobile();

  const handleView = useCallback(() => {
    toJsonSchemaTab();
    track(AmpEvent.USE_VIEW_ATTACHED_JSON);
  }, [toJsonSchemaTab]);

  const handleAttach = useCallback(() => {
    onOpen();
    track(AmpEvent.USE_ATTACHED_JSON_MODAL);
  }, [onOpen]);

  return (
    <Box my={8}>
      <Heading as="h6" mb={6} variant="h6">
        Code Info
      </Heading>
      <Flex
        flexWrap={isMobile ? "wrap" : "nowrap"}
        gap={isMobile ? 6 : 12}
        minH="100px"
      >
        <CodeInfoLabelText label="Network">{chainId}</CodeInfoLabelText>
        <CodeInfoLabelText label="Uploaded by">
          <Flex gap={1} w="150px" direction="column">
            <ExplorerLink
              type={uploaderType}
              value={uploader}
              showCopyOnHover
            />
            <Text variant="body3" color="text.dark">
              {getAddressTypeText(uploaderType)}
            </Text>
          </Flex>
        </CodeInfoLabelText>
        {isFullTier && methodRender}
        <CodeInfoLabelText label="Instantiate Permission">
          <Flex gap={1} direction="column">
            <PermissionChip
              instantiatePermission={instantiatePermission}
              permissionAddresses={permissionAddresses}
            />
            <ViewPermissionAddresses
              amptrackSection="code_details"
              permissionAddresses={permissionAddresses}
            />
          </Flex>
        </CodeInfoLabelText>
        {isFullTier && (
          <CodeInfoLabelText
            gridColumn={{ base: "1 / span 2", md: "5 / span 1" }}
            label="Stored on block"
          >
            <Flex gap={1} direction="column">
              {storedBlockRender}
            </Flex>
          </CodeInfoLabelText>
        )}
        {!isMobile && (
          <CodeInfoLabelText
            label="JSON Schema"
            maxW={{ md: "fit-content" }}
            w={{ base: "full" }}
          >
            <div>
              <Button
                p="8px 6px"
                variant="outline-primary"
                leftIcon={
                  attached ? undefined : (
                    <CustomIcon name="upload" boxSize={4} />
                  )
                }
                onClick={attached ? handleView : handleAttach}
              >
                {attached ? "View Schema" : "Attach"}
              </Button>
              <JsonSchemaModal
                isOpen={isOpen}
                codeHash={hash}
                codeId={codeId}
                onClose={onClose}
              />
            </div>
          </CodeInfoLabelText>
        )}
      </Flex>
    </Box>
  );
};
