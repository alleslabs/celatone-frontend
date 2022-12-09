import { Text, Flex, Button, SlideFade } from "@chakra-ui/react";
import type { EncodeObject } from "@cosmjs/proto-signing";
import { useWallet } from "@cosmos-kit/react";
import { useCallback, useMemo, useState } from "react";
import { BsArrowCounterclockwise } from "react-icons/bs";

import {
  useFabricateFee,
  useSimulateFee,
  useTxBroadcast,
  useResendTx,
} from "lib/app-provider";
import { FailedModal } from "lib/pages/instantiate/component";
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

const MsgDetail = ({ msg, success }: MsgDetailProps) => {
  const [button, setButton] = useState<"redo" | "resend" | "">("");
  const [showButton, setShowButton] = useState(false);
  const { currentChainName } = useWallet();

  const displayMsg = useMemo(() => {
    const type = extractMsgType(msg.type);
    if (type === "MsgExecuteContract") {
      const detailExecute = msg.detail as DetailExecute;
      setButton("redo");
      const singleMsgProps: SingleMsgProps = success
        ? {
            type: "Execute",
            tags: [Object.keys(detailExecute.msg)[0]],
            text2: "on",
            link2: detailExecute.contract,
          }
        : {
            type: "Failed",
            text1: "to execute message from",
            link2: detailExecute.contract,
          };
      return <SingleMsg {...singleMsgProps} />;
      // Type Upload
    }
    if (type === "MsgStoreCode") {
      const msgUpload = msg.detail as DetailUpload;
      setButton("");
      const singleMsgProps: SingleMsgProps = success
        ? {
            type: "Upload",
            text1: "WASM to Code ID",
            text2: msgUpload.id?.toString(),
          }
        : {
            type: "Failed ",
            text1: "to upload WASM file",
          };
      return <SingleMsg {...singleMsgProps} />;

      // Type Instantiate
    }
    // TODO - Refactor

    if (type === "MsgInstantiateContract") {
      const msgInstantiate = msg.detail as DetailInstantiate;
      if (!success) {
        setButton("");
        return (
          <SingleMsg
            type="Failed"
            text1="to instantiate contract from Code ID"
            text2={msgInstantiate.codeId.toString()}
          />
        );
      }
      setButton("redo");
      return (
        <SingleMsg
          type="Instantiate"
          text1="contract"
          link1={msgInstantiate.label}
          link1Copy={msgInstantiate.contractAddress}
          text2={`from Code ID ${msgInstantiate.codeId.toString()}`}
        />
      );
      // Send message
    }
    // TODO - Refactor

    if (type === "MsgSend") {
      const msgSend = msg.detail as DetailSend;
      setButton("resend");

      const coins = msgSend.amount.map(
        (amount) =>
          `${formatUToken(amount.amount as U<Token>)} ${formatUDenom(
            amount.denom
          )} `
      );

      if (!success) {
        // Not able to resend if failed
        setButton("");
        return (
          <SingleMsg
            type="Failed"
            text1="to send assets to"
            link2={msgSend.toAddress}
          />
        );
      }
      return (
        <SingleMsg
          type="Send"
          bolds={coins}
          text2="to"
          link2={msgSend.toAddress}
        />
      );
    }
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
  }, [msg.detail, msg.type, success]);

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

export default MsgDetail;
