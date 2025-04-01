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
  code: Code;
  chainId: string;
  attached: boolean;
  toJsonSchemaTab: () => void;
}

const getMethodSpecificRender = (
  proposal: Option<Code["proposal"]>,
  transaction: Option<Code["transaction"]>
): { methodRender: JSX.Element; storedBlockRender: JSX.Element } => {
  if (proposal) {
    const { id, height, created } = proposal;
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
    const { hash, height, created } = transaction;
    return {
      methodRender: (
        <CodeInfoLabelText label="Upload transaction">
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
  code,
  chainId,
  attached,
  toJsonSchemaTab,
}: CodeInfoSectionProps) => {
  const { isFullTier } = useTierConfig();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const getAddressType = useGetAddressType();
  const {
    codeId,
    proposal,
    uploader,
    instantiatePermission,
    permissionAddresses,
    transaction,
    hash,
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
      <Heading as="h6" variant="h6" mb={6}>
        Code Info
      </Heading>
      <Flex
        flexWrap={isMobile ? "wrap" : "nowrap"}
        gap={isMobile ? 6 : 12}
        minH="100px"
      >
        <CodeInfoLabelText label="Network">{chainId}</CodeInfoLabelText>
        <CodeInfoLabelText label="Uploaded by">
          <Flex direction="column" gap={1} w="150px">
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
        <CodeInfoLabelText label="Instantiate permission">
          <Flex direction="column" gap={1}>
            <PermissionChip
              instantiatePermission={instantiatePermission}
              permissionAddresses={permissionAddresses}
            />
            <ViewPermissionAddresses
              permissionAddresses={permissionAddresses}
              amptrackSection="code_details"
            />
          </Flex>
        </CodeInfoLabelText>
        {isFullTier && (
          <CodeInfoLabelText
            label="Stored on block"
            gridColumn={{ base: "1 / span 2", md: "5 / span 1" }}
          >
            <Flex direction="column" gap={1}>
              {storedBlockRender}
            </Flex>
          </CodeInfoLabelText>
        )}
        {!isMobile && (
          <CodeInfoLabelText
            label="JSON Schema"
            w={{ base: "full" }}
            maxW={{ md: "fit-content" }}
          >
            <div>
              <Button
                variant="outline-primary"
                p="8px 6px"
                leftIcon={
                  attached ? undefined : (
                    <CustomIcon name="upload" boxSize={4} />
                  )
                }
                onClick={attached ? handleView : handleAttach}
              >
                {attached ? "View schema" : "Attach"}
              </Button>
              <JsonSchemaModal
                isOpen={isOpen}
                onClose={onClose}
                codeId={codeId}
                codeHash={hash}
              />
            </div>
          </CodeInfoLabelText>
        )}
      </Flex>
    </Box>
  );
};
