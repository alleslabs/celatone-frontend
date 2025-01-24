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
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { JsonFragment } from "ethers";
import { AmpEvent, track } from "lib/amplitude";
import { CopyButton } from "lib/components/copy";
import { EvmAbiForm } from "lib/components/evm-abi";
import { CustomIcon } from "lib/components/icon";
import { useEthCall } from "lib/services/evm";
import { type HexAddr20, type JsonDataType, Option } from "lib/types";
import {
  dateFromNow,
  decodeEvmFunctionResult,
  encodeEvmFunctionData,
  getCurrentDate,
} from "lib/utils";
import { isUndefined } from "lodash";

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
    <Text variant="body3" color="text.dark" opacity={timestamp ? 1 : 0}>
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
  const inputRequired =
    abiSection.inputs && abiSection.inputs.length > 0 ? true : false;
  const data = useMemo(
    () => encodeEvmFunctionData(abiSection, inputs),
    [abiSection, inputs]
  );
  const { refetch, isFetching } = useEthCall(contractAddress, data ?? "", {
    enabled: !isUndefined(data) && opened,
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
        <AccordionButton p={4}>
          <Text variant="body1" fontWeight={700}>
            {abiSection.name}
          </Text>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel mx={2}>
        <Grid templateColumns={inputRequired ? "1fr 1fr" : "1fr"} columnGap={6}>
          {inputRequired && (
            <GridItem>
              <Text variant="body2" color="text.dark" fontWeight={700} mb={3}>
                Read Inputs
              </Text>
              <EvmAbiForm
                types={abiSection.inputs ?? []}
                isPayable={abiSection.stateMutability === "payable"}
                propsOnChangeInputs={setInputs}
              />
              <Flex gap={2} justify="flex-start" mt={3}>
                <CopyButton
                  variant="outline-secondary"
                  isDisable={isUndefined(data)}
                  value={data ?? ""}
                  amptrackSection="read_inputs"
                  buttonText="Copy Encoded Inputs"
                />
                <EvmCodeSnippet />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRead}
                  isDisabled={!isUndefined(data)}
                  isLoading={isFetching}
                  leftIcon={<CustomIcon name="query" />}
                  ml="auto"
                >
                  Read
                </Button>
              </Flex>
            </GridItem>
          )}
          <GridItem>
            <Text variant="body2" color="text.dark" fontWeight={700} mb={3}>
              Read Outputs
            </Text>
            {queryError && (
              <Alert variant="error" mb={3} alignItems="center">
                <AlertDescription wordBreak="break-word">
                  {queryError}
                </AlertDescription>
              </Alert>
            )}
            <Flex direction="column" gap={2}>
              <EvmAbiForm
                types={abiSection.outputs ?? []}
                initialData={decodeEvmFunctionResult(abiSection, res)}
                isDisabled
              />
              <TimestampText timestamp={timestamp} />
            </Flex>
            {!inputRequired ? (
              <Flex gap={2} justify="flex-start" mt={3}>
                <CopyButton
                  variant="outline-secondary"
                  isDisable={isUndefined(data)}
                  value={data ?? ""}
                  amptrackSection="read_inputs"
                  buttonText="Copy Encoded Inputs"
                />
                <EvmCodeSnippet />
                <Flex gap={2} ml="auto">
                  <CopyButton
                    variant="outline-secondary"
                    isDisable={res === "" || Boolean(queryError)}
                    value={res}
                    amptrackSection="read_outputs"
                    buttonText="Copy Encoded Outputs"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleRead();
                      track(AmpEvent.ACTION_EVM_READ_AGAIN);
                    }}
                    isDisabled={isUndefined(data)}
                    isLoading={isFetching}
                    leftIcon={<CustomIcon name="query" />}
                    ml="auto"
                  >
                    Read Again
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <CopyButton
                variant="outline-secondary"
                isDisable={res === "" || Boolean(queryError)}
                value={res}
                amptrackSection="read_outputs"
                buttonText="Copy Encoded Outputs"
              />
            )}
          </GridItem>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};
