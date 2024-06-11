import type { BechAddr, MessageResponse } from "lib/types";

// TODO: we should extract the sender from the message depending on the message type
export const extractSender = (message: MessageResponse): BechAddr =>
  (message?.sender ||
    message?.signer ||
    message?.fromAddress ||
    message?.delegatorAddress ||
    message?.proposer ||
    message?.depositor ||
    message?.submitter ||
    message?.voter ||
    "") as BechAddr;
