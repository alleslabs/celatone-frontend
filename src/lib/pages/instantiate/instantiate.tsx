import {
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import Long from "long";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useFabricateFee, useSimulateFee } from "lib/app-provider";
import { useInstantiateTx } from "lib/app-provider/tx/instantiate";
import { ControllerInput, TextInput } from "lib/components/forms";
import JsonInput from "lib/components/json/JsonInput";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { HumanAddr, Token, U } from "lib/types";
import { MsgType } from "lib/types";
import {
  composeMsg,
  decode,
  demicrofy,
  jsonValidate,
  microfy,
} from "lib/utils";

import { AssetInput, CodeSelect, FailedModal, Footer } from "./component";
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
  const { address = "", currentChainRecord } = useWallet();
  const postInstantiateTx = useInstantiateTx();
  const { simulate } = useSimulateFee();
  const fabricateFee = useFabricateFee();
  const { broadcast } = useTxBroadcast();
  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [method, setMethod] = useState<"select-existing" | "fill-manually">(
    "select-existing"
  );
  const [codeId, setCodeId] = useState("");
  const [error, setError] = useState("");
  const [simulating, setSimulating] = useState(false);

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const { control, setValue, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      label: "",
      adminAddress: "",
      initMsg: "",
      assets: [{ denom: "", amount: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });
  const watchAssets = watch("assets");
  const watchInitMsg = watch("initMsg");
  const selectedAssets = watchAssets.map((asset) => asset.denom);

  const disableInstantiate = useMemo(() => {
    return !codeId || !address || !!jsonValidate(watchInitMsg);
  }, [codeId, address, watchInitMsg]);

  // TODO: create this as hook later
  const assetOptions = useMemo(
    () =>
      currentChainRecord?.assetList.assets
        .filter((asset) => !asset.base.includes("cw20"))
        .map((asset) => ({
          label: asset.symbol,
          value: asset.base,
          disabled: selectedAssets.includes(asset.base),
        })) ?? [],
    [currentChainRecord, selectedAssets]
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
        setError((e as Error).message);
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
  ]);

  // ------------------------------------------//
  // --------------SIDE EFFECTS----------------//
  // ------------------------------------------//
  useEffect(() => {
    if (codeIdQuery) setCodeId(codeIdQuery);
    if (msgQuery) {
      const decodedMsg = decode(msgQuery);
      try {
        const msgObject = JSON.parse(decodedMsg) as InstantiateRedoMsg;

        setCodeId(String(msgObject.code_id));
        reset({
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
  }, [codeIdQuery, msgQuery, reset]);

  return (
    <>
      <WasmPageContainer>
        <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
          DEPLOY NEW CONTRACT
        </Text>
        <Stepper currentStep={2} />
        <Heading as="h4" variant="h4" my="48px">
          Instantiate new contract
        </Heading>
        <RadioGroup
          onChange={(nextVal: "select-existing" | "fill-manually") =>
            setMethod(nextVal)
          }
          value={method}
          w="100%"
        >
          <Flex justify="space-around">
            <Radio value="select-existing" size="lg">
              Select from your code
            </Radio>
            <Radio value="fill-manually" size="lg">
              Fill Code ID manually
            </Radio>
          </Flex>
        </RadioGroup>
        {method === "select-existing" ? (
          <CodeSelect
            mt="16px"
            mb="32px"
            onCodeSelect={(code: string) => setCodeId(code)}
            codeId={codeId}
          />
        ) : (
          <TextInput
            variant="floating"
            label="Code ID"
            helperText="Input existing Code ID manually"
            my="32px"
            value={codeId}
            setInputState={setCodeId}
          />
        )}
        <form>
          <ControllerInput
            name="label"
            control={control}
            label="Label"
            helperText="Label will help remind you or other contract viewer to understand what this contract do and how it works"
            variant="floating"
            mb="32px"
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
      {error && <FailedModal errorLog={error} onClose={() => setError("")} />}
    </>
  );
};

export default Instantiate;
