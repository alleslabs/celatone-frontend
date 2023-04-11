import {
  Button,
  Flex,
  Box,
  IconButton,
  Text,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  useDisclosure,
  chakra,
  Tooltip,
} from "@chakra-ui/react";
import Big from "big.js";

import { BackButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type { PoolDetail } from "lib/types/pool";
import { jsonPrettify, truncate } from "lib/utils";
import { formatPercentValue } from "lib/utils/formatter/formatPercentValue";

import { PoolHeader } from "./PoolHeader";

interface PoolDetailHeaderProp {
  pool: PoolDetail;
}
const unwrapScalingFactor = ({
  scaling_factors,
  scaling_factor_controller,
}: PoolDetail) => ({
  scaling_factors,
  scaling_factor_controller,
});

const StyledTextLabel = chakra(Text, {
  baseStyle: {
    color: "text.dark",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.1px",
  },
});
const StyledTextContent = chakra(Text, {
  baseStyle: {
    color: "text.main",
    letterSpacing: "0.1px",
    fontSize: "14px",
  },
});
export const PoolDetailHeader = ({ pool }: PoolDetailHeaderProp) => {
  const {
    isOpen: isModalWeightOpen,
    onClose: onModalWeightClose,
    onOpen: onModalWeightOpen,
  } = useDisclosure();
  const {
    isOpen: isModalScalingOpen,
    onClose: onModalScalingClose,
    onOpen: onModalScalingOpen,
  } = useDisclosure();
  return (
    <>
      <BackButton />
      <Flex mt={4} justifyContent="space-between" alignItems="flex-start">
        <PoolHeader
          poolId={pool.pool_id}
          isSuperFluid={pool.is_superfluid}
          poolType={pool.pool_type}
          poolLiquidity={pool.pool_liquidity}
        />
        <Flex gap={2} alignItems="flex-start">
          <Button
            variant="ghost-gray"
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="pebble.400" />
            }
          >
            View in JSON
          </Button>
          <Button
            variant="outline-primary"
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="violet.light" />
            }
          >
            View in Osmosis
          </Button>
          <IconButton
            size="md"
            _hover={{ backgroundColor: "pebble.700" }}
            variant="none"
            aria-label="save"
            color="pebble.600"
            icon={<CustomIcon name="bookmark" />}
          />
        </Flex>
      </Flex>
      <Flex
        background="pebble.900"
        borderRadius="8px"
        px={4}
        py={3}
        gap={12}
        mt={6}
      >
        <Flex flexDirection="column" gap={1}>
          <StyledTextLabel> Pool ID</StyledTextLabel>
          <StyledTextContent color="lilac.main">
            {pool.pool_id}
          </StyledTextContent>
        </Flex>
        <Flex flexDirection="column" gap={1}>
          <StyledTextLabel> Created Height</StyledTextLabel>
          <StyledTextContent color="lilac.main">
            {pool.create_tx_id}
          </StyledTextContent>
        </Flex>
        <Flex flexDirection="column" gap={1}>
          <StyledTextLabel> Pool Created by</StyledTextLabel>
          <StyledTextContent color="lilac.main">
            <ExplorerLink
              type="user_address"
              value={truncate(pool.account.address)}
            />
          </StyledTextContent>
        </Flex>
        <Flex flexDirection="column" gap={1}>
          <Flex alignItems="center" gap={1}>
            <StyledTextLabel>Swap Fee</StyledTextLabel>
            <Tooltip
              hasArrow
              label="The fee charged for making a swap in a pool, defined by the pool creator, and paid by traders in the form of a percentage the input swap asset amount"
              placement="top"
              bg="honeydew.darker"
              arrowSize={8}
            >
              <Flex cursor="pointer">
                <CustomIcon name="info-circle" boxSize="12px" />
              </Flex>
            </Tooltip>
          </Flex>
          <StyledTextContent>
            {formatPercentValue(Big(pool.swap_fee).times(100))}
          </StyledTextContent>
        </Flex>
        <Flex flexDirection="column" gap={1}>
          <Flex alignItems="center" gap={1}>
            <StyledTextLabel>Exit Fee</StyledTextLabel>
            <Tooltip
              hasArrow
              label="The fee charged when withdrawing from a pool, defined by the pool creator, and paid by the withdrawer in the form of LP tokens"
              placement="top"
              bg="honeydew.darker"
              arrowSize={8}
            >
              <Flex cursor="pointer">
                <CustomIcon name="info-circle" boxSize="12px" />
              </Flex>
            </Tooltip>
          </Flex>
          <StyledTextContent>
            {formatPercentValue(Big(pool.exit_fee).times(100))}
          </StyledTextContent>
        </Flex>
        <Flex flexDirection="column" gap={1}>
          <StyledTextLabel>Future Governor</StyledTextLabel>
          <Tag
            borderRadius="full"
            size="sm"
            bg="pebble.700"
            color="text.main"
            w="fit-content"
          >
            {pool.future_pool_governor}
          </Tag>
        </Flex>
        {pool.smooth_weight_change_params && (
          <Flex flexDirection="column" gap={1}>
            <StyledTextLabel> Smooth weight change params</StyledTextLabel>
            <StyledTextContent
              onClick={onModalWeightOpen}
              color="lilac.main"
              cursor="pointer"
              _hover={{ color: "lilac.light" }}
              transition="all .25s ease-in-out"
            >
              View JSON
              <CustomIcon name="chevron-right" boxSize={3} color="lilac.main" />
            </StyledTextContent>

            <Modal
              isOpen={isModalWeightOpen}
              onClose={onModalWeightClose}
              isCentered
              size="4xl"
            >
              <ModalOverlay />
              <ModalContent w="840px">
                <ModalHeader>
                  <CustomIcon name="code" boxSize="6" />
                  <Heading as="h5" variant="h5">
                    Smooth weight change params
                  </Heading>
                </ModalHeader>
                <ModalCloseButton color="pebble.600" />
                <ModalBody p={4} maxH="640px" overflow="scroll">
                  <Box
                    bgColor="background.main"
                    borderRadius="8px"
                    position="relative"
                  >
                    <JsonReadOnly
                      text={jsonPrettify(
                        JSON.stringify(pool.smooth_weight_change_params)
                      )}
                      canCopy
                      showLines={16}
                    />
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
        )}
        {pool.scaling_factors && (
          <Flex flexDirection="column" gap={1}>
            <StyledTextLabel>Scaling Factor</StyledTextLabel>
            <StyledTextContent
              onClick={onModalScalingOpen}
              color="lilac.main"
              cursor="pointer"
              _hover={{ color: "lilac.light" }}
              transition="all .25s ease-in-out"
            >
              View JSON
              <CustomIcon name="chevron-right" boxSize={3} color="lilac.main" />
            </StyledTextContent>

            <Modal
              isOpen={isModalScalingOpen}
              onClose={onModalScalingClose}
              isCentered
              size="4xl"
            >
              <ModalOverlay />
              <ModalContent w="840px">
                <ModalHeader>
                  <CustomIcon name="code" boxSize="6" />
                  <Heading as="h5" variant="h5">
                    Scaling Factor
                  </Heading>
                </ModalHeader>
                <ModalCloseButton color="pebble.600" />
                <ModalBody p={4} maxH="640px" overflow="scroll">
                  <Box
                    bgColor="background.main"
                    borderRadius="8px"
                    position="relative"
                  >
                    <JsonReadOnly
                      text={jsonPrettify(
                        JSON.stringify(unwrapScalingFactor(pool))
                      )}
                      canCopy
                      showLines={16}
                    />
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
        )}
      </Flex>
    </>
  );
};
