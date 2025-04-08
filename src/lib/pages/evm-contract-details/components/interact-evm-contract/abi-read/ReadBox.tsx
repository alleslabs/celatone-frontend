import type { JsonFragment } from "ethers";
import type { Option, HexAddr20, JsonDataType } from "lib/types";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CopyButton } from "lib/components/copy";
import { EvmAbiForm } from "lib/components/evm-abi";
import { CustomIcon } from "lib/components/icon";
import { useEthCall } from "lib/services/evm";
import {
  dateFromNow,
  decodeEvmFunctionResult,
  encodeEvmFunctionData,
  getCurrentDate,
} from "lib/utils";
import { isUndefined } from "lodash";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

const EvmCodeSnippet = dynamic(
  () => import("lib/components/modal/EvmCodeSnippet"),
  {
    ssr: false,
  }
);

const TimestampText = memo(({ timestamp }: { timestamp: Option<Date> }) => {
  const [, setRenderCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount((prev) => prev + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Text color="text.dark" opacity={timestamp ? 1 : 0} variant="body3">
      ({timestamp ? `Last queried ${dateFromNow(timestamp)}` : "N/A"})
    </Text>
  );
});

interface ReadBoxProps {
  contractAddress: HexAddr20;
  abiSection: JsonFragment;
  opened: boolean;
}

export const ReadBox = ({
  contractAddress,
  abiSection,
  opened,
}: ReadBoxProps) => {
  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [inputs, setInputs] = useState<JsonDataType[]>([]);
  const [res, setRes] = useState<string>("");
  const [queryError, setQueryError] = useState("");
  const [timestamp, setTimestamp] = useState<Date>();

  // ------------------------------------------//
  // -------------------LOGICS-----------------//
  // ------------------------------------------//
  const inputRequired = !!abiSection.inputs?.length;
  const data = useMemo(
    () => encodeEvmFunctionData(abiSection, inputs),
    [abiSection, inputs]
  );
  const { refetch, isFetching } = useEthCall(contractAddress, data ?? "", {
    enabled: opened && !isUndefined(data) && !inputRequired,
    retry: false,
    cacheTime: 0,
    onSuccess: (data) => {
      setQueryError("");
      setRes(data);
      setTimestamp(getCurrentDate());
    },
    onError: (err) => {
      setQueryError((err as Error).message);
      setTimestamp(undefined);
      setRes("");
    },
  });

  // ------------------------------------------//
  // ------------------CALLBACKS---------------//
  // ------------------------------------------//
  const handleRead = useCallback(() => {
    track(AmpEvent.ACTION_EVM_READ, {
      inputRequired,
    });
    refetch();
  }, [inputRequired, refetch]);

  return (
    <AccordionItem className={`abi_read_${abiSection.name}`}>
      <h6>
        <AccordionButton justifyContent="space-between" p={4}>
          <Text fontWeight={700} variant="body1">
            {abiSection.name}
          </Text>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel mx={2}>
        <Grid
          gap={6}
          templateColumns={{
            md: inputRequired ? "1fr 1fr" : "1fr",
            base: "1fr",
          }}
        >
          {inputRequired && (
            <GridItem>
              <Text variant="body2" color="text.dark" fontWeight={700} mb={3}>
                Read inputs
              </Text>
              <EvmAbiForm
                isPayable={abiSection.stateMutability === "payable"}
                propsOnChangeInputs={setInputs}
                types={abiSection.inputs ?? []}
              />
              <Flex
                flexDirection={{
                  md: "row",
                  base: "column",
                }}
                gap={2}
                justifyContent="space-between"
                mt={6}
              >
                <HStack gap={2}>
                  <CopyButton
                    amptrackSection="read_inputs"
                    buttonText="Copy encoded inputs"
                    w="100%"
                  />
                  <EvmCodeSnippet
                    abiSection={abiSection}
                    contractAddress={contractAddress}
                    inputs={inputs}
                    type="read"
                  />
                </HStack>
                <Button
                  isDisabled={isUndefined(data)}
                  isLoading={isFetching}
                  leftIcon={<CustomIcon name="query" />}
                  size="sm"
                  variant="primary"
                  onClick={handleRead}
                >
                  Read
                </Button>
              </Flex>
            </GridItem>
          )}
          <GridItem>
            <Text variant="body2" color="text.dark" fontWeight={700} mb={3}>
              Read outputs
            </Text>
            {queryError && (
              <Alert alignItems="center" mb={3} variant="error">
                <AlertDescription wordBreak="break-word">
                  {queryError}
                </AlertDescription>
              </Alert>
            )}
            <Flex direction="column" gap={2}>
              <EvmAbiForm
                initialData={decodeEvmFunctionResult(abiSection, res)}
                isDisabled
                types={abiSection.outputs ?? []}
              />
              <TimestampText timestamp={timestamp} />
            </Flex>
            {!inputRequired ? (
              <Flex
                flexDirection={{
                  md: "row",
                  base: "column",
                }}
                gap={2}
                justifyContent="space-between"
                mt={3}
              >
                <Grid gap={2} gridTemplateColumns="1fr 1fr">
                  <HStack gap={2}>
                    <CopyButton
                      amptrackSection="read_inputs"
                      buttonText="Copy encoded inputs"
                      w="100%"
                    />
                    <EvmCodeSnippet
                      abiSection={abiSection}
                      contractAddress={contractAddress}
                      type="read"
                    />
                  </HStack>
                  <CopyButton
                    amptrackSection="read_outputs"
                    buttonText="Copy encoded outputs"
                    display={{ md: "none", base: "block" }}
                    isDisable={res === "" || Boolean(queryError)}
                    value={res}
                    variant="outline-secondary"
                    w="100%"
                  />
                </Grid>
                <Flex
                  gap={{
                    md: 2,
                    base: 0,
                  }}
                >
                  <CopyButton
                    amptrackSection="read_outputs"
                    buttonText="Copy encoded outputs"
                    display={{ base: "none", md: "block" }}
                    isDisable={res === "" || Boolean(queryError)}
                    value={res}
                    variant="outline-secondary"
                  />
                  <Button
                    isDisabled={isUndefined(data)}
                    isLoading={isFetching}
                    leftIcon={<CustomIcon name="query" />}
                    size="sm"
                    variant="primary"
                    w="100%"
                    onClick={() => {
                      handleRead();
                      track(AmpEvent.ACTION_EVM_READ_AGAIN);
                    }}
                  >
                    Read again
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <Flex
                flexDirection={{
                  md: "row",
                  base: "column",
                }}
                justifyContent="flex-end"
                mt={{
                  md: 0,
                  base: 3,
                }}
              >
                <CopyButton
                  amptrackSection="read_outputs"
                  buttonText="Copy encoded outputs"
                  w="100%"
                />
              </Flex>
            )}
          </GridItem>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};
