import {
  Td,
  Tr,
  Flex,
  Tag,
  Text,
  useDisclosure,
  Collapse,
  Button,
  Icon,
} from "@chakra-ui/react";
import type { EncodeObject } from "@cosmjs/proto-signing";
import { useWallet } from "@cosmos-kit/react";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { BsArrowCounterclockwise } from "react-icons/bs";
import {
  MdCheck,
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

import {
  useFabricateFee,
  useSimulateFee,
  useTxBroadcast,
} from "lib/app-provider";
import { useResendTx } from "lib/app-provider/tx/resend";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { FailedModal } from "lib/pages/instantiate/component";
import type {
  DetailExecute,
  DetailInstantiate,
  DetailSend,
  DetailUpload,
  Token,
  Transaction,
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

import MsgDetail from "./MsgDetail";
import { MultipleMsg } from "./MultipleMsg";
import { SingleMsg } from "./SingleMsg";

interface PastTxTableProps {
  element: Transaction;
}

const PastTxTable = ({ element }: PastTxTableProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const [isAccordion, setIsAccordion] = useState(false);
  const [button, setButton] = useState<"redo" | "resend" | "">("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentChainName } = useWallet();

  const extractMessage = useCallback((data: Transaction) => {
    const uploadMsgs: DetailUpload[] = [];
    const executeMsgs: DetailExecute[] = [];
    const instantiateMsgs: DetailInstantiate[] = [];
    const sendMsgs: DetailSend[] = [];
    setButton("");
    data.messages.forEach((msgs) => {
      const type = extractMsgType(msgs.type);
      // Case where msg does not failed
      if (Object.keys(msgs.detail).length !== 0) {
        switch (type) {
          case "MsgInstantiateContract": {
            const detailInstantiate = msgs.detail as DetailInstantiate;
            instantiateMsgs.push(detailInstantiate);
            break;
          }

          case "MsgStoreCode": {
            const detailUpload = msgs.detail as DetailUpload;
            uploadMsgs.push(detailUpload);
            break;
          }

          case "MsgExecuteContract": {
            const detailExecute = msgs.detail as DetailExecute;
            executeMsgs.push(detailExecute);
            break;
          }

          case "MsgSend": {
            const detailSend = msgs.detail as DetailSend;
            sendMsgs.push(detailSend);
            break;
          }
          default:
            break;
        }
      }
    });

    return { uploadMsgs, executeMsgs, instantiateMsgs, sendMsgs } as const;
  }, []);

  // TODO - Refactor
  const renderUpload = useCallback(
    (uploadMsgs: Array<DetailUpload>) => {
      if (uploadMsgs.length > 1) {
        if (!element.success) {
          return (
            <MultipleMsg
              type="Failed to upload"
              length={uploadMsgs.length}
              text="WASM files"
            />
          );
        }
        return (
          <MultipleMsg
            type="Upload"
            length={uploadMsgs.length}
            text="WASM files"
          />
        );
      }
      if (!element.success) {
        return <SingleMsg type="Failed " text1="to upload WASM file" />;
      }
      return (
        <SingleMsg
          type="Upload"
          text1="WASM to Code ID"
          text2={uploadMsgs[0].id.toString()}
        />
      );
    },
    [element.success]
  );

  // TODO - Refactor
  const renderInstantiate = useCallback(
    (instantiateMsgs: Array<DetailInstantiate>) => {
      if (instantiateMsgs.length > 1) {
        setIsAccordion(true);
        setButton("resend");
        if (!element.success) {
          setButton("");

          return (
            <MultipleMsg
              type="Fail to instantiate"
              length={instantiateMsgs.length}
              text="contracts"
            />
          );
        }
        return (
          <MultipleMsg
            type="Instantiate"
            length={instantiateMsgs.length}
            text="contracts"
          />
        );
      }
      setButton("redo");
      if (!element.success) {
        return (
          <SingleMsg
            type="Fail"
            text1="to instantiate contract from Code ID"
            link2={instantiateMsgs[0].codeId.toString()}
          />
        );
      }
      return (
        <SingleMsg
          type="Instantiate"
          text1="contract"
          link1={instantiateMsgs[0].label}
          link1Copy={instantiateMsgs[0].contractAddress}
          text2={`from Code ID ${instantiateMsgs[0].codeId.toString()}`}
        />
      );
    },
    [element.success]
  );

  // TODO - Refactor
  const renderExecute = useCallback(
    (executeMsgs: Array<DetailExecute>) => {
      const tags = [Object.keys(executeMsgs[0].msg)[0]];
      const contractAddr = executeMsgs[0].contract;
      if (executeMsgs.length > 1) {
        tags.push(Object.keys(executeMsgs[1].msg)[0]);
      }

      if (executeMsgs.some((msg) => msg.contract !== contractAddr)) {
        setIsAccordion(true);
        setButton("resend");

        if (!element.success) {
          setButton("");

          return (
            <MultipleMsg
              type="Failed to execute messages from "
              length={executeMsgs.length}
              text="contracts"
            />
          );
        }

        return (
          <MultipleMsg
            type="Execute"
            tags={tags}
            length={executeMsgs.length}
            text="contracts"
          />
        );
      }
      if (executeMsgs.length === 1) {
        setButton("redo");
      } else {
        setIsAccordion(true);
        setButton("resend");
      }

      if (!element.success) {
        return (
          <SingleMsg
            type="Failed"
            text1="to execute message from"
            link2={executeMsgs[0].contract}
          />
        );
      }
      return (
        <SingleMsg
          type="Execute"
          tags={tags}
          length={executeMsgs.length}
          text2="on"
          link2={executeMsgs[0].contract}
        />
      );
    },
    [element.success]
  );

  // TODO - Refactor
  const renderSend = useCallback(
    (sendMsgs: Array<DetailSend>) => {
      setButton("resend");
      if (!element.success) {
        setButton("");

        return <SingleMsg type="Failed" text1="to send assets" />;
      }
      if (sendMsgs.length === 1) {
        const coins = sendMsgs[0].amount.map(
          (amount) =>
            `${formatUToken(amount.amount as U<Token>)} ${formatUDenom(
              amount.denom
            )}`
        );
        return (
          <SingleMsg
            type="Send"
            bolds={coins}
            text2="to"
            link2={sendMsgs[0].toAddress}
          />
        );
      }
      setIsAccordion(true);
      if (!element.success) {
        setButton("");

        return (
          <MultipleMsg
            type="Failed to send "
            length={sendMsgs.length}
            text="to addresses"
          />
        );
      }
      return (
        <MultipleMsg
          type="Send assets to"
          length={sendMsgs.length}
          text="addresses"
        />
      );
    },
    [element.success]
  );

  // TODO - Have to refator the way to display text
  // eslint-disable-next-line complexity
  const displayInfo = useMemo(() => {
    // Reset accordion display
    setIsAccordion(false);
    const { uploadMsgs, executeMsgs, instantiateMsgs, sendMsgs } =
      extractMessage(element);
    if (
      uploadMsgs.length !== 0 &&
      executeMsgs.length === 0 &&
      instantiateMsgs.length === 0 &&
      sendMsgs.length === 0
    ) {
      return renderUpload(uploadMsgs);
    }
    if (
      instantiateMsgs.length !== 0 &&
      uploadMsgs.length === 0 &&
      executeMsgs.length === 0 &&
      sendMsgs.length === 0
    ) {
      return renderInstantiate(instantiateMsgs);
    }
    if (
      executeMsgs.length !== 0 &&
      instantiateMsgs.length === 0 &&
      uploadMsgs.length === 0 &&
      sendMsgs.length === 0
    ) {
      return renderExecute(executeMsgs);
    }
    if (
      sendMsgs.length !== 0 &&
      executeMsgs.length === 0 &&
      instantiateMsgs.length === 0 &&
      uploadMsgs.length === 0
    ) {
      return renderSend(sendMsgs);
    }
    // Combine all
    setIsAccordion(true);
    // Disable resend when transaction contains upload
    if (uploadMsgs.length === 0 && element.success) {
      setButton("resend");
    }

    return (
      <>
        {/* Execute */}
        {executeMsgs.length !== 0 && (
          <>
            Execute <Tag borderRadius="full">{executeMsgs.length}</Tag>
          </>
        )}{" "}
        {/* Instantiate */}
        {instantiateMsgs.length !== 0 && (
          <>
            Instantiate <Tag borderRadius="full">{instantiateMsgs.length}</Tag>
          </>
        )}{" "}
        {/* Upload */}
        {uploadMsgs.length !== 0 && (
          <>
            Upload <Tag borderRadius="full">{uploadMsgs.length}</Tag>
          </>
        )}{" "}
        {/* Send */}
        {sendMsgs.length !== 0 && (
          <>
            Send <Tag borderRadius="full">{sendMsgs.length}</Tag>
          </>
        )}
      </>
    );
  }, [
    element,
    extractMessage,
    renderExecute,
    renderInstantiate,
    renderSend,
    renderUpload,
  ]);

  const hideBorder = isAccordion && isOpen ? "none" : "";

  const fabricateFee = useFabricateFee();
  const { simulate } = useSimulateFee();
  const resendTx = useResendTx();
  const { broadcast } = useTxBroadcast();

  // TODO - Redundant, refactor
  const onClickResend = useCallback(
    async (e: MouseEvent) => {
      e.stopPropagation();

      setIsButtonLoading(true);
      const messages = [] as EncodeObject[];
      element.messages.forEach((msg) => {
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
      });
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

      return null;
    },
    [element.messages, simulate, resendTx, broadcast, fabricateFee]
  );

  const renderTimestamp = () => {
    const localDate = element.block.timestamp.concat("Z");
    return (
      <Flex direction="column">
        <Text>
          {dayjs(localDate).utc().format("MMM DD, YYYY, h:mm:ss A [UTC]")}
        </Text>
        <Text>({dayjs(localDate).fromNow()})</Text>
      </Flex>
    );
  };

  return (
    <>
      <Tr
        key={element.hash}
        onClick={onToggle}
        _hover={{ background: "rgba(255, 255, 255, 0.12)" }}
        sx={{
          "& td:first-child": { pl: "48px" },
          "& td:last-child": { pr: "48px" },
        }}
      >
        <Td border={hideBorder}>
          <Flex role="group" w="fit-content">
            <ExplorerLink
              value={element.hash.substring(2)}
              type="tx_hash"
              canCopy
            />
          </Flex>
        </Td>
        <Td border={hideBorder}>
          {element.success ? (
            <Icon as={MdCheck} fontSize="24px" color="#66BB6A" />
          ) : (
            <Icon as={MdClose} fontSize="24px" color="#EF5350" />
          )}
        </Td>
        <Td border={hideBorder}>
          <Flex gap={1} fontSize="14px">
            {displayInfo}
            {element.isIbc && (
              <Tag borderRadius="full" bg="rgba(164, 133, 231, 0.6)">
                IBC
              </Tag>
            )}
          </Flex>
        </Td>
        <Td border={hideBorder}>
          <Text variant="body2" color="text.dark">
            {renderTimestamp()}
          </Text>
        </Td>
        <Td border={hideBorder} color="text.dark">
          <Flex justify="end">
            {button === "redo" && (
              <Button
                leftIcon={<BsArrowCounterclockwise />}
                variant="outline"
                iconSpacing="2"
                size="sm"
                onClick={(e) =>
                  onClickRedo(
                    e,
                    extractMsgType(element?.messages[0]?.type),
                    element.messages[0].msg,
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
          </Flex>
        </Td>
        <Td border={hideBorder} color="text.dark">
          {isAccordion && !isOpen && <MdKeyboardArrowDown />}
          {isAccordion && isOpen && <MdKeyboardArrowUp />}
        </Td>
      </Tr>
      {isAccordion && (
        <Tr hidden={!isOpen}>
          <Td colSpan={6} p="0" border="none">
            <Collapse in={isOpen} animateOpacity>
              <Flex py="12px" bg="gray.900" direction="column">
                {element.messages.map((item, index) => (
                  <MsgDetail
                    key={index.toString() + item.type}
                    msg={item}
                    success={element.success}
                  />
                ))}
              </Flex>
            </Collapse>
          </Td>
        </Tr>
      )}
      {error && <FailedModal errorLog={error} onClose={() => setError("")} />}
    </>
  );
};

export default PastTxTable;
