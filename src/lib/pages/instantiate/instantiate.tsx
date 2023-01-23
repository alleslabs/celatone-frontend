import { Button, Heading, Text } from "@chakra-ui/react";
import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import Long from "long";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  useFabricateFee,
  useNativeTokensInfo,
  useSimulateFee,
} from "lib/app-provider";
import { useInstantiateTx } from "lib/app-provider/tx/instantiate";
import { CodeSelectSection } from "lib/components/CodeSelectSection";
import { ControllerInput } from "lib/components/forms";
import { AssetInput } from "lib/components/forms/AssetInput";
import JsonInput from "lib/components/json/JsonInput";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { HumanAddr, Token, U } from "lib/types";
import { MsgType } from "lib/types";
import {
  composeMsg,
  demicrofy,
  jsonValidate,
  libDecode,
  microfy,
} from "lib/utils";

import { FailedModal, Footer } from "./component";
import type { InstantiateRedoMsg } from "./types";

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
  const { address = "" } = useWallet();
  const postInstantiateTx = useInstantiateTx();
  const { simulate } = useSimulateFee();
  const fabricateFee = useFabricateFee();
  const { broadcast } = useTxBroadcast();
  const nativeTokensInfo = useNativeTokensInfo();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [simulating, setSimulating] = useState(false);

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const {
    control,
    formState: { errors: formErrors },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm({
    mode: "all",
    defaultValues: {
      codeId: "",
      label: "",
      adminAddress: "",
      initMsg: "",
      assets: [{ denom: "", amount: "" }],
      simulateError: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });
  const {
    codeId,
    assets: watchAssets,
    initMsg: watchInitMsg,
    simulateError,
  } = watch();

  const selectedAssets = watchAssets.map((asset) => asset.denom);

  const disableInstantiate = useMemo(() => {
    return (
      !codeId || !address || !!jsonValidate(watchInitMsg) || !!formErrors.label
    );
  }, [codeId, address, watchInitMsg, formErrors.label]);

  const assetOptions = useMemo(
    () =>
      nativeTokensInfo.map((asset) => ({
        label: asset.symbol,
        value: asset.base,
        disabled: selectedAssets.includes(asset.base),
      })),
    [nativeTokensInfo, selectedAssets]
  );

  // ------------------------------------------//
  // ----------------FUNCTIONS-----------------//
  // ------------------------------------------//
  const proceed = useCallback(() => {
    handleSubmit(async ({ adminAddress, label, initMsg, assets }) => {
      setSimulating(true);
      const funds = assets
        .filter((asset) => asset.amount && asset.denom)
        .map((asset) => ({
          ...asset,
          amount: microfy(asset.amount as Token).toFixed(0),
        }));
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
    address,
    codeId,
    handleSubmit,
    fabricateFee,
    postInstantiateTx,
    simulate,
    broadcast,
    onComplete,
    setValue,
  ]);

  // ------------------------------------------//
  // --------------SIDE EFFECTS----------------//
  // ------------------------------------------//
  useEffect(() => {
    if (codeIdQuery) setValue("codeId", codeIdQuery);
    if (msgQuery) {
      const decodedMsg = libDecode(msgQuery);
      try {
        const msgObject = JSON.parse(decodedMsg) as InstantiateRedoMsg;

        reset({
          codeId: msgObject.code_id.toString(),
          label: msgObject.label,
          adminAddress: msgObject.admin,
          initMsg: JSON.stringify(msgObject.msg, null, 2),
          assets:
            msgObject.funds.length === 0
              ? [{ denom: "", amount: "" }]
              : msgObject.funds.map((fund) => ({
                  ...fund,
                  amount: demicrofy(fund.amount as U<Token>).toFixed(),
                })),
        });
      } catch {
        // comment just to avoid eslint no-empty
      }
    }
  }, [codeIdQuery, msgQuery, reset, setValue]);

  return (
    <>
      <WasmPageContainer>
        <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
          DEPLOY NEW CONTRACT
        </Text>
        <Stepper mode="deploy" currentStep={2} />
        <Heading as="h4" variant="h4" my="48px">
          Instantiate new contract
        </Heading>

        <CodeSelectSection
          name="codeId"
          control={control}
          error={formErrors.codeId?.message}
          onCodeSelect={(code: string) => setValue("codeId", code)}
          codeId={codeId}
        />
        <form style={{ width: "100%" }}>
          <ControllerInput
            name="label"
            control={control}
            error={formErrors.label?.message}
            label="Label"
            helperText="Label will help remind you or other contract viewer to understand what this contract do and how it works"
            variant="floating"
            mb="32px"
            rules={{ required: "Label is required" }}
          />
          <ControllerInput
            name="adminAddress"
            control={control}
            label="Admin Address (optional)"
            helperText="This address will be the admin for the deployed smart contract."
            variant="floating"
          />
          <Heading
            variant="h6"
            as="h6"
            color="text.main"
            my="32px"
            alignSelf="flex-start"
          >
            Instantiate Message
          </Heading>
          <JsonInput
            text={watchInitMsg}
            setText={(newVal: string) => setValue("initMsg", newVal)}
            height="120px"
          />
          <Heading
            variant="h6"
            as="h6"
            color="text.main"
            my="32px"
            alignSelf="flex-start"
          >
            Send asset to contract
          </Heading>
          {fields.map((field, idx) => (
            <AssetInput
              key={field.id}
              disableDelete={fields.length <= 1}
              onDelete={() => remove(idx)}
              setCurrencyValue={(newVal: string) =>
                setValue(`assets.${idx}.denom`, newVal)
              }
              assetOptions={assetOptions}
              initialSelected={field.denom}
              amountInput={
                <ControllerInput
                  name={`assets.${idx}.amount`}
                  control={control}
                  label="Amount"
                  variant="floating"
                  type="number"
                />
              }
            />
          ))}
          <Button
            variant="outline-primary"
            mt="32px"
            mx="auto"
            onClick={() => append({ denom: "", amount: "" })}
            disabled={assetOptions.length === selectedAssets.length}
          >
            Add More Asset
          </Button>
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
