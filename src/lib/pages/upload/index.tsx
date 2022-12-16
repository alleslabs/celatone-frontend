import { Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";

import {
  useFabricateFee,
  useSimulateFee,
  useUploadContractTx,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { DropZone } from "lib/components/dropzone";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { FormStatus } from "lib/components/forms";
import { TextInput } from "lib/components/forms";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import {
  getMaxCodeDescriptionLengthError,
  MAX_CODE_DESCRIPTION_LENGTH,
} from "lib/data";
import { useCodeStore, useUserKey } from "lib/hooks";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { HumanAddr } from "lib/types";
import { AccessType, MsgType } from "lib/types";
import { composeMsg } from "lib/utils";

import { UploadCard } from "./components/UploadCard";
import type { SimulateStatus } from "./types";

const Upload = () => {
  const router = useRouter();
  const userKey = useUserKey();
  const { simulate, loading } = useSimulateFee();
  const fabricateFee = useFabricateFee();
  const { address = "" } = useWallet();
  const { broadcast } = useTxBroadcast();
  const { updateCodeInfo } = useCodeStore();

  const [wasmFile, setFile] = useState<File>();
  const [codeDesc, setCodeDesc] = useState("");
  const [descStatus, setDescStatus] = useState<FormStatus>({
    state: "init",
  });
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateStatus, setSimulateStatus] =
    useState<SimulateStatus>("Pending");
  const [simulateError, setSimulateError] = useState<string>("");

  const postUploadTx = useUploadContractTx(
    wasmFile?.name,
    wasmFile?.arrayBuffer(),
    estimatedFee
  );

  // TODO: apply useForm
  useEffect(() => {
    const trimedDescription = codeDesc.trim();
    if (trimedDescription.length === 0) {
      setDescStatus({ state: "init" });
    } else if (trimedDescription.length > MAX_CODE_DESCRIPTION_LENGTH)
      setDescStatus({
        state: "error",
        message: getMaxCodeDescriptionLengthError(trimedDescription.length),
      });
    else setDescStatus({ state: "success" });
  }, [codeDesc]);

  const proceed = useCallback(async () => {
    const stream = await postUploadTx({
      onTxSucceed: (codeId: number) => {
        updateCodeInfo(userKey, codeId, {
          description: codeDesc || `${wasmFile?.name}(${codeId})`,
        });
      },
      codeDesc,
    });

    if (stream) broadcast(stream);
  }, [postUploadTx, broadcast, codeDesc, updateCodeInfo, wasmFile, userKey]);

  useEffect(() => {
    (async () => {
      if (wasmFile) {
        setSimulateStatus("Pending");
        setSimulateError("");
        const msg = composeMsg(MsgType.STORE_CODE, {
          sender: address as HumanAddr,
          wasmByteCode: new Uint8Array(await wasmFile.arrayBuffer()),
          instantiatePermission: {
            permission: AccessType.ACCESS_TYPE_ONLY_ADDRESS,
            address: address as HumanAddr,
          },
        });
        try {
          const estimatedGasUsed = await simulate([msg]);
          if (estimatedGasUsed) {
            setEstimatedFee(fabricateFee(estimatedGasUsed));
            setSimulateStatus("Completed");
          }
        } catch (err) {
          setSimulateStatus("Failed");
          setSimulateError((err as Error).message);
        }
      }
    })();
  }, [wasmFile, address, simulate, fabricateFee]);

  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper currentStep={1} />
      <Heading as="h4" variant="h4" my="48px">
        Upload wasm file
      </Heading>
      <ConnectWalletAlert
        subtitle="You need to connect wallet to proceed this action"
        mb="48px"
      />
      {wasmFile ? (
        <UploadCard
          file={wasmFile}
          deleteFile={() => {
            setFile(undefined);
            setEstimatedFee(undefined);
          }}
          simulateStatus={simulateStatus}
          simulateError={simulateError}
        />
      ) : (
        <DropZone setFile={(file) => setFile(file)} />
      )}
      <TextInput
        variant="floating"
        value={codeDesc}
        setInputState={setCodeDesc}
        label="Code Description (Optional)"
        helperText="Define what your code works on in one sentence. You can add this later."
        my="32px"
        status={descStatus}
      />
      <Flex
        fontSize="14px"
        color="text.dark"
        alignSelf="flex-start"
        alignItems="center"
        display="flex"
        gap="4px"
      >
        Transaction Fee:{" "}
        <EstimatedFeeRender estimatedFee={estimatedFee} loading={loading} />
      </Flex>
      <Flex justify="space-between" w="100%" mt="32px">
        <Button
          size="md"
          variant="outline-gray"
          w="128px"
          leftIcon={
            <Icon as={FiChevronLeft} color="text.dark" fontSize="18px" />
          }
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          size="md"
          variant="primary"
          w="128px"
          disabled={!estimatedFee || !wasmFile || descStatus.state === "error"}
          onClick={proceed}
        >
          Upload
        </Button>
      </Flex>
    </WasmPageContainer>
  );
};

export default Upload;
