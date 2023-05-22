import { Heading, Text } from "@chakra-ui/react";
import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import Long from "long";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useFabricateFee,
  useSimulateFee,
  useInstantiateTx,
  useCelatoneApp,
  useLCDEndpoint,
  useValidateAddress,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";
import { AttachFund } from "lib/components/fund";
import { defaultAsset, defaultAssetJsonStr } from "lib/components/fund/data";
import type { AttachFundsState } from "lib/components/fund/types";
import { AttachFundsType } from "lib/components/fund/types";
import JsonInput from "lib/components/json/JsonInput";
import { CodeSelectSection } from "lib/components/select-code";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import {
  AmpEvent,
  AmpTrack,
  AmpTrackAction,
  AmpTrackToInstantiate,
} from "lib/services/amplitude";
import { getCodeIdInfo } from "lib/services/code";
import type { HumanAddr } from "lib/types";
import { AccessConfigPermission, MsgType } from "lib/types";
import {
  composeMsg,
  getAttachFunds,
  jsonPrettify,
  jsonValidate,
  libDecode,
} from "lib/utils";

import { FailedModal, Footer } from "./component";
import type { InstantiateRedoMsg } from "./types";

interface InstantiatePageState {
  codeId: string;
  label: string;
  adminAddress: string;
  initMsg: string;
  simulateError: string;
}
interface InstantiatePageProps {
  onComplete: (txResult: InstantiateResult, contractLabel: string) => void;
}

const Instantiate = ({ onComplete }: InstantiatePageProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const router = useRouter();
  const msgQuery = (router.query.msg as string) ?? "";
  const codeIdQuery = (router.query["code-id"] as string) ?? "";
  const {
    appContractAddress: { example: exampleContractAddress },
  } = useCelatoneApp();
  const { address = "" } = useWallet();
  const endpoint = useLCDEndpoint();
  const postInstantiateTx = useInstantiateTx();
  const { simulate } = useSimulateFee();
  const fabricateFee = useFabricateFee();
  const { broadcast } = useTxBroadcast();
  const { validateUserAddress, validateContractAddress } = useValidateAddress();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [simulating, setSimulating] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ state: "init" });

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const {
    control,
    formState: { errors: formErrors },
    setValue,
    watch,
    handleSubmit,
  } = useForm<InstantiatePageState>({
    mode: "all",
    defaultValues: {
      codeId: "",
      label: "",
      adminAddress: "",
      initMsg: "",
      simulateError: "",
    },
  });

  const {
    codeId,
    adminAddress: watchAdminAddress,
    initMsg: watchInitMsg,
    simulateError,
  } = watch();

  const {
    control: assetsControl,
    setValue: setAssets,
    watch: watchAssets,
  } = useForm<AttachFundsState>({
    mode: "all",
    defaultValues: {
      assetsSelect: defaultAsset,
      assetsJsonStr: defaultAssetJsonStr,
      attachFundsOption: AttachFundsType.ATTACH_FUNDS_NULL,
    },
  });

  const { assetsSelect, assetsJsonStr, attachFundsOption } = watchAssets();

  const disableInstantiate = useMemo(() => {
    return (
      !codeId ||
      !address ||
      !!jsonValidate(watchInitMsg) ||
      Object.keys(formErrors).length > 0 ||
      status.state !== "success"
    );
    // formErrors change doesnt trigger this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeId, address, watchInitMsg, Object.keys(formErrors), status.state]);

  const funds = getAttachFunds({
    attachFundsOption,
    assetsJsonStr,
    assetsSelect,
  });

  const { refetch } = useQuery(
    ["query", endpoint, codeId],
    async () => getCodeIdInfo(endpoint, Number(codeId)),
    {
      enabled: !!address && !!codeId.length,
      retry: false,
      cacheTime: 0,
      onSuccess(data) {
        const permission = data.code_info.instantiate_permission;
        if (
          address &&
          (permission.permission === AccessConfigPermission.EVERYBODY ||
            permission.addresses.includes(address as HumanAddr) ||
            permission.address === address)
        )
          setStatus({ state: "success" });
        else {
          setStatus({
            state: "error",
            message:
              "This wallet does not have permission to instantiate to this code",
          });
        }
      },
      onError() {
        setStatus({ state: "error", message: "This code ID does not exist" });
      },
    }
  );

  // ------------------------------------------//
  // ----------------FUNCTIONS-----------------//
  // ------------------------------------------//
  const proceed = useCallback(() => {
    handleSubmit(async ({ adminAddress, label, initMsg }) => {
      AmpTrackAction(AmpEvent.ACTION_EXECUTE, funds.length, attachFundsOption);

      setSimulating(true);

      const msg = composeMsg(MsgType.INSTANTIATE, {
        sender: address as HumanAddr,
        admin: adminAddress as HumanAddr,
        codeId: Long.fromString(codeId),
        label,
        msg: Buffer.from(initMsg),
        funds,
      });
      try {
        const estimatedFee = await simulate([msg]);
        const stream = await postInstantiateTx({
          estimatedFee: estimatedFee ? fabricateFee(estimatedFee) : undefined,
          codeId: Number(codeId),
          initMsg: JSON.parse(initMsg),
          label,
          admin: adminAddress,
          funds,
          onTxSucceed: onComplete,
        });

        if (stream) broadcast(stream);
        setSimulating(false);
      } catch (e) {
        setValue("simulateError", (e as Error).message);
        setSimulating(false);
      }
    })();
  }, [
    funds,
    handleSubmit,
    attachFundsOption,
    address,
    codeId,
    simulate,
    postInstantiateTx,
    fabricateFee,
    onComplete,
    broadcast,
    setValue,
  ]);

  // ------------------------------------------//
  // --------------SIDE EFFECTS----------------//
  // ------------------------------------------//
  useEffect(() => {
    if (codeId.length) {
      setStatus({ state: "loading" });
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      return () => clearTimeout(timer);
    }
    setStatus({ state: "init" });

    return () => {};
  }, [address, codeId, refetch]);

  useEffect(() => {
    if (codeIdQuery) setValue("codeId", codeIdQuery);
    if (msgQuery) {
      const decodedMsg = libDecode(msgQuery);
      try {
        const msgObject = JSON.parse(decodedMsg) as InstantiateRedoMsg;

        setValue("codeId", msgObject.code_id.toString());
        setValue("label", msgObject.label);
        setValue("adminAddress", msgObject.admin);
        setValue("initMsg", JSON.stringify(msgObject.msg, null, 2));

        if (msgObject.funds.length) {
          setAssets("assetsSelect", defaultAsset);
          setAssets(
            "assetsJsonStr",
            jsonPrettify(JSON.stringify(msgObject.funds))
          );
          setAssets("attachFundsOption", AttachFundsType.ATTACH_FUNDS_JSON);
        }
      } catch {
        // comment just to avoid eslint no-empty
      }
    }
  }, [codeIdQuery, msgQuery, setAssets, setValue]);

  useEffect(() => {
    if (router.isReady) AmpTrackToInstantiate(!!msgQuery, !!codeIdQuery);
  }, [router.isReady, msgQuery, codeIdQuery]);

  const validateAdmin = useCallback(
    (input: string) =>
      input && !!validateContractAddress(input) && !!validateUserAddress(input)
        ? "Invalid Address."
        : undefined,
    [validateContractAddress, validateUserAddress]
  );

  return (
    <>
      <WasmPageContainer>
        <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
          DEPLOY NEW CONTRACT
        </Text>
        <Stepper mode="deploy" currentStep={2} />
        <Heading as="h5" variant="h5" my="48px">
          Instantiate new contract
        </Heading>
        <ConnectWalletAlert
          subtitle="You need to connect your wallet to perform this action"
          mb={6}
        />
        <CodeSelectSection
          name="codeId"
          control={control}
          status={status}
          error={formErrors.codeId?.message}
          onCodeSelect={(code: string) => setValue("codeId", code)}
          codeId={codeId}
        />
        <form style={{ width: "100%" }}>
          <ControllerInput
            name="label"
            control={control}
            error={formErrors.label?.message}
            placeholder="ex. Token Factory"
            label="Label"
            helperText="The contract's label help briefly describe the contract and what it does."
            variant="floating"
            mb="32px"
            rules={{ required: "Label is required" }}
          />
          <ControllerInput
            name="adminAddress"
            control={control}
            label="Admin Address (optional)"
            placeholder={`ex. ${exampleContractAddress}`}
            helperText="The contract's admin will be able to migrate and update future admins."
            variant="floating"
            error={validateAdmin(watchAdminAddress)}
            helperAction={
              <Text
                color="accent.main"
                fontWeight="600"
                variant="body3"
                cursor="pointer"
                onClick={() => {
                  AmpTrack(AmpEvent.USE_ASSIGN_ME);
                  setValue("adminAddress", address);
                }}
              >
                Assign me
              </Text>
            }
          />
          <Heading variant="h6" as="h6" my="32px" alignSelf="flex-start">
            Instantiate Message
          </Heading>
          <JsonInput
            text={watchInitMsg}
            setText={(newVal: string) => setValue("initMsg", newVal)}
            minLines={10}
          />
          <Heading variant="h6" as="h6" my="32px" alignSelf="flex-start">
            Send asset to contract
          </Heading>
          <AttachFund
            control={assetsControl}
            setValue={setAssets}
            attachFundsOption={attachFundsOption}
          />
        </form>
      </WasmPageContainer>
      <Footer
        onInstantiate={proceed}
        disabled={disableInstantiate}
        loading={simulating}
      />
      {simulateError && (
        <FailedModal
          errorLog={simulateError}
          onClose={() => setValue("simulateError", "")}
        />
      )}
    </>
  );
};

export default Instantiate;
