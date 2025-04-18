import type { Code } from "lib/services/types";
import type { Option } from "lib/types";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useGetAddressType, useMobile, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { JsonSchemaModal } from "lib/components/json-schema";
import { PermissionChip } from "lib/components/PermissionChip";
import { ViewPermissionAddresses } from "lib/components/ViewPermissionAddresses";
import { dateFromNow, formatUTC, getAddressTypeText } from "lib/utils";
import { useCallback } from "react";

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
    const { created, height, id } = proposal;
    return {
      methodRender: (
        <CodeInfoLabelText label="Proposal ID">
          <ExplorerLink
            showCopyOnHover
            type="proposal_id"
            value={id.toString()}
          />
        </CodeInfoLabelText>
      ),
      storedBlockRender:
        height && created ? (
          <>
            <ExplorerLink
              showCopyOnHover
              type="block_height"
              value={height.toString()}
            />
            <Text color="text.dark" variant="body3">
              {formatUTC(created)}
            </Text>
            <Text color="text.dark" variant="body3">
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
        <CodeInfoLabelText label="Upload transaction">
          <Flex minW="150px">
            <ExplorerLink showCopyOnHover type="tx_hash" value={hash} />
          </Flex>
        </CodeInfoLabelText>
      ),
      storedBlockRender:
        height && created ? (
          <>
            <ExplorerLink
              showCopyOnHover
              type="block_height"
              value={height.toString()}
            />
            <Text color="text.dark" variant="body3">
              {formatUTC(created)}
            </Text>
            <Text color="text.dark" variant="body3">
              {dateFromNow(created)}
            </Text>
          </>
        ) : (
          <Text color="text.dark" variant="body3">
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
        Code info
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
              showCopyOnHover
              type={uploaderType}
              value={uploader}
            />
            <Text color="text.dark" variant="body3">
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
            <Flex direction="column" gap={1}>
              {storedBlockRender}
            </Flex>
          </CodeInfoLabelText>
        )}
        {!isMobile && (
          <CodeInfoLabelText
            label="JSON schema"
            maxW={{ md: "fit-content" }}
            w={{ base: "full" }}
          >
            <div>
              <Button
                leftIcon={
                  attached ? undefined : (
                    <CustomIcon boxSize={4} name="upload" />
                  )
                }
                p="8px 6px"
                variant="outline-primary"
                onClick={attached ? handleView : handleAttach}
              >
                {attached ? "View schema" : "Attach"}
              </Button>
              <JsonSchemaModal
                codeHash={hash}
                codeId={codeId}
                isOpen={isOpen}
                onClose={onClose}
              />
            </div>
          </CodeInfoLabelText>
        )}
      </Flex>
    </Box>
  );
};
