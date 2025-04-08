import type { JsonFragment } from "ethers";
import type { SimulatedFeeEvm } from "lib/services/types";
import type { HexAddr20, JsonDataType } from "lib/types";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useRequestEvmTx } from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { EstimatedFeeEvmRender } from "lib/components/EstimatedFeeEvmRender";
import { EvmAbiForm } from "lib/components/evm-abi";
import { CustomIcon } from "lib/components/icon";
import { useTxBroadcast } from "lib/hooks";
import { useSimulateFeeEvmQuery } from "lib/services/tx";
import { encodeEvmFunctionData } from "lib/utils";
import { isUndefined } from "lodash";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const EvmCodeSnippet = dynamic(
  () => import("lib/components/modal/EvmCodeSnippet"),
  {
    ssr: false,
  }
);

interface WriteBoxProps {
  contractAddress: HexAddr20;
  abiSection: JsonFragment;
  opened: boolean;
}

export const WriteBox = ({
  contractAddress,
  abiSection,
  opened,
}: WriteBoxProps) => {
  // ------------------------------------------//
  // --------------DEPENDENCIES----------------//
  // ------------------------------------------//
  const requestEvmTx = useRequestEvmTx();
  const { broadcast } = useTxBroadcast();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [fee, setFee] = useState<SimulatedFeeEvm>();
  const [inputs, setInputs] = useState<JsonDataType[]>([]);
  const [value, setValue] = useState("");
  const [simulateFeeError, setSimulateFeeError] = useState<string>();
  const [processing, setProcessing] = useState(false);

  // ------------------------------------------//
  // -------------------LOGICS-----------------//
  // ------------------------------------------//

  const data = useMemo(
    () => encodeEvmFunctionData(abiSection, inputs),
    [abiSection, inputs]
  );
  const enabledExecute = useMemo(
    () => opened && !isUndefined(data),
    [opened, data]
  );

  // ------------------------------------------//
  // -----------------REACT QUERY--------------//
  // ------------------------------------------//
  const { isFetching } = useSimulateFeeEvmQuery({
    enabled: enabledExecute,
    to: contractAddress,
    data: data ?? "",
    value,
    onSuccess: (gasRes) => {
      setSimulateFeeError(undefined);
      if (gasRes) setFee(gasRes);
      else setFee(undefined);
    },
    onError: (e) => {
      setSimulateFeeError(e.message);
      setFee(undefined);
    },
  });

  // ------------------------------------------//
  // ------------------CALLBACKS---------------//
  // ------------------------------------------//
  const handleChangeInputs = useCallback((formInputs: JsonDataType[]) => {
    setInputs(formInputs);

    // reset fee and error when user change the input
    setSimulateFeeError(undefined);
    setFee(undefined);
  }, []);
  const handleChangeValue = useCallback((formValue: string) => {
    setValue(formValue);

    // reset fee and error when user change the input
    setSimulateFeeError(undefined);
    setFee(undefined);
  }, []);

  const proceed = useCallback(async () => {
    track(AmpEvent.ACTION_EVM_WRITE);
    const stream = await requestEvmTx({
      to: contractAddress,
      data: data ?? "",
      value,
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
      estimatedFee: fee,
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [broadcast, contractAddress, data, fee, requestEvmTx, value]);

  // ------------------------------------------//
  // ----------------SIDE EFFECTS--------------//
  // ------------------------------------------//

  useEffect(() => {
    if (data === undefined) setFee(undefined);
  }, [data]);

  return (
    <AccordionItem className={`abi_write_${abiSection.name}`}>
      <h6>
        <AccordionButton justifyContent="space-between" p={4}>
          <Text fontWeight={700} variant="body1">
            {abiSection.name}
          </Text>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel mx={2}>
        <Flex direction="column" gap={6}>
          <EvmAbiForm
            isPayable={abiSection.stateMutability === "payable"}
            propsOnChangeInputs={handleChangeInputs}
            propsOnChangeValue={handleChangeValue}
            types={abiSection.inputs ?? []}
          />
          {simulateFeeError && (
            <Alert alignItems="center" variant="error">
              <AlertDescription wordBreak="break-word">
                {simulateFeeError}
              </AlertDescription>
            </Alert>
          )}
          <Flex align="center" justifyContent="space-between">
            <Flex gap={2} justify="flex-start">
              <CopyButton
                amptrackSection="write_inputs"
                buttonText="Copy encoded inputs"
              />
              <EvmCodeSnippet
                abiSection={abiSection}
                contractAddress={contractAddress}
                inputs={inputs}
                type="write"
              />
            </Flex>
            <Flex align="center" direction="row" gap={2}>
              <Flex alignItems="center" color="text.dark" fontSize="14px">
                Transaction fee:{" "}
                <EstimatedFeeEvmRender
                  gasPrice={fee?.gasPrice}
                  gasUsed={fee?.simulatedGasUsed}
                  loading={isFetching}
                />
              </Flex>
              <Button
                fontSize="14px"
                isDisabled={!enabledExecute || !fee || isFetching}
                isLoading={processing}
                leftIcon={<CustomIcon name="execute" />}
                p="6px 16px"
                sx={{ pointerEvents: processing && "none" }}
                variant="primary"
                onClick={proceed}
              >
                Execute
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};
