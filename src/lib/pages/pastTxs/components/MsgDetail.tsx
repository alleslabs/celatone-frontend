import { Text, Flex, Button, SlideFade } from "@chakra-ui/react";
import type { EncodeObject } from "@cosmjs/proto-signing";
import { useWallet } from "@cosmos-kit/react";
import { useCallback, useMemo, useState } from "react";
import { BsArrowCounterclockwise } from "react-icons/bs";

import { useFabricateFee, useSimulateFee, useResendTx } from "lib/app-provider";
import { useContractStore } from "lib/hooks";
import { FailedModal } from "lib/pages/instantiate/component";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type {
  DetailExecute,
  DetailInstantiate,
  DetailSend,
  DetailUpload,
  Message,
  Token,
  U,
} from "lib/types";
import {
  camelToSnake,
  encode,
  formatUDenom,
  formatUToken,
  extractMsgType,
  onClickRedo,
} from "lib/utils";

import type { SingleMsgProps } from "./SingleMsg";
import { SingleMsg } from "./SingleMsg";
import { StepperItem } from "./StepperItem";

interface MsgDetailProps {
  msg: Message;
  success: boolean;
}

export const MsgDetail = ({ msg, success }: MsgDetailProps) => {
  const [button, setButton] = useState<"redo" | "resend" | "">("");
  const [showButton, setShowButton] = useState(false);
  const { currentChainName } = useWallet();
  const { getContractLocalInfo } = useContractStore();

  // TODO - Refactor to reduce complexity
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const displayMsg = useMemo(() => {
    const type = extractMsgType(msg.type);
    // Type Execute
    if (type === "MsgExecuteContract") {
      const detailExecute = msg.detail as DetailExecute;
      const contractLocalInfo = getContractLocalInfo(detailExecute.contract);
      // Able to redo even fail transaction
      setButton("redo");
      const singleMsgProps: SingleMsgProps = success
        ? {
            type: "Execute",
            tags: [Object.keys(detailExecute.msg)[0]],
            text2: "on",
            link1: {
              type: "contract_address",
              value: contractLocalInfo?.name || detailExecute.contract,
              copyValue: detailExecute.contract,
            },
          }
        : {
            type: "Failed",
            text1: "to execute message from",
            link1: {
              type: "contract_address",
              value: contractLocalInfo?.name || detailExecute.contract,
              copyValue: detailExecute.contract,
            },
          };
      return <SingleMsg {...singleMsgProps} />;
    }
    // Type Upload
    if (type === "MsgStoreCode") {
      const msgUpload = msg.detail as DetailUpload;
      // Not able to resend or redo
      setButton("");
      const singleMsgProps: SingleMsgProps = success
        ? {
            type: "Upload",
            text1: "Wasm to Code ID",
            link1: {
              type: "code_id",
              value: msgUpload.id?.toString(),
            },
          }
        : {
            type: "Failed",
            text1: "to upload Wasm file",
          };
      return <SingleMsg {...singleMsgProps} />;
    }
    // Type Instantiate
    if (type === "MsgInstantiateContract") {
      const msgInstantiate = msg.detail as DetailInstantiate;
      const contractLocalInfo = getContractLocalInfo(
        msgInstantiate.contractAddress
      );
      // Not able to redo if failure
      if (!success) {
        setButton("");
        return (
          <SingleMsg
            type="Failed"
            text1="to instantiate contract from Code ID"
            link1={{
              type: "code_id",
              value: msgInstantiate.codeId.toString(),
            }}
          />
        );
      }
      setButton("redo");
      return (
        <SingleMsg
          type="Instantiate"
          text1="contract"
          link1={{
            type: "contract_address",
            value: contractLocalInfo?.name || msgInstantiate.contractAddress,
            copyValue: msgInstantiate.contractAddress,
          }}
          text3="from Code ID"
          link2={{
            type: "code_id",
            value: msgInstantiate.codeId.toString(),
          }}
        />
      );
    }
    // Type Send
    if (type === "MsgSend") {
      const msgSend = msg.detail as DetailSend;
      setButton("resend");

      const coins = msgSend.amount.map(
        (amount) =>
          `${formatUToken(amount.amount as U<Token>)} ${formatUDenom(
            amount.denom
          )} `
      );

      // Not able to resend if failure
      if (!success) {
        // Not able to resend if failed
        setButton("");
        return (
          <SingleMsg
            type="Failed"
            text1="to send assets to"
            link2={{
              type: "contract_address",
              value: msgSend.toAddress,
            }}
          />
        );
      }
      return (
        <SingleMsg
          type="Send"
          bolds={coins}
          text2="to"
          link2={{
            type: "contract_address",
            value: msgSend.toAddress,
          }}
        />
      );
    }
    // Type Others
    if (type) {
      if (!success) {
        // Not able to resend if failed
        setButton("");
        return (
          <SingleMsg
            type="Failed"
            text1="to process"
            tags={[type.substring(3)]}
          />
        );
      }
      setButton("resend");
      return <SingleMsg type="Message" tags={[type.substring(3)]} />;
    }
    return null;
  }, [getContractLocalInfo, msg.detail, msg.type, success]);

  const fabricateFee = useFabricateFee();
  const { simulate } = useSimulateFee();
  const resendTx = useResendTx();
  const { broadcast } = useTxBroadcast();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO - Redundant, refactor
  const onClickResend = useCallback(
    async (e: React.MouseEvent<Element, MouseEvent>) => {
      e.stopPropagation();

      setIsButtonLoading(true);
      const messages = [] as EncodeObject[];
      // TODO - Refactor
      if (msg.msg.msg) {
        messages.push({
          typeUrl: msg.type,
          value: {
            ...msg.msg,
            msg: encode(JSON.stringify(camelToSnake(msg.msg.msg))),
          },
        });
      } else {
        messages.push({
          typeUrl: msg.type,
          value: {
            ...msg.msg,
          },
        });
      }
      try {
        const estimatedGasUsed = await simulate(messages);
        let fee;
        if (estimatedGasUsed) {
          fee = fabricateFee(estimatedGasUsed);
        }
        const stream = await resendTx({
          onTxSucceed: () => {},
          estimatedFee: fee,
          messages,
        });
        if (stream) broadcast(stream);
        setIsButtonLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setIsButtonLoading(false);
      }
    },
    [msg, simulate, resendTx, broadcast, fabricateFee]
  );

  return (
    <Flex
      w="full"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      _hover={{ background: "divider.main" }}
      css={{
        "&:not(:first-of-type) div#before-stepper": {
          visibility: "visible",
        },
      }}
    >
      <Flex pl="20%" h="40px" alignItems="center">
        <StepperItem />
        <Flex mx="24px">
          <Text variant="body2">{displayMsg}</Text>
        </Flex>
        <SlideFade in={showButton} offsetY="20px">
          {button === "redo" && (
            <Button
              variant="outline"
              size="sm"
              iconSpacing="2"
              leftIcon={<BsArrowCounterclockwise />}
              onClick={(e) =>
                onClickRedo(
                  e,
                  extractMsgType(msg.type),
                  msg.msg,
                  currentChainName
                )
              }
            >
              Redo
            </Button>
          )}
          {button === "resend" && (
            <Button
              variant="outline"
              iconSpacing="0"
              size="sm"
              onClick={(e) => onClickResend(e)}
              isDisabled={isButtonLoading}
            >
              Resend
            </Button>
          )}
        </SlideFade>
      </Flex>
      {error && <FailedModal errorLog={error} onClose={() => setError("")} />}
    </Flex>
  );
};
