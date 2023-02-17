import { Flex, Text } from "@chakra-ui/react";
import { findAttribute } from "@cosmjs/stargate/build/logs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { PermissionChip } from "lib/components/PermissionChip";
import { TxReceiptRender } from "lib/components/tx/receipt";
import { ViewPermissionAddresses } from "lib/components/ViewPermissionAddresses";
import type { AddressReturnType } from "lib/hooks";
import { useGetAddressType } from "lib/hooks";
import type { TxReceipt } from "lib/types";

import type { TxMsgData } from ".";

interface TxMsgDetailsProps extends TxMsgData {
  isExpand: boolean;
}

const getReceipts = (
  { type, value, log }: TxMsgData,
  getAddressType: (address: string) => AddressReturnType
): TxReceipt[] => {
  switch (type) {
    case "wasm/MsgStoreCode": {
      const codeId = log
        ? findAttribute([log], "store_code", "code_id").value
        : "N/A";
      return [
        ...(log
          ? [
              {
                title: "Stored Code ID",
                html: <ExplorerLink value={codeId} type="code_id" />,
              },
            ]
          : []),
        {
          title: "Uploader",
          html: (
            <ExplorerLink
              value={value.sender}
              type={getAddressType(value.sender)}
            />
          ),
        },
        ...(value.instantiatePermission
          ? [
              {
                title: "Instantiate Permission",
                html: (
                  <Flex direction="column" gap={1}>
                    <PermissionChip
                      instantiatePermission={
                        value.instantiatePermission.permission
                      }
                      permissionAddresses={
                        value.instantiatePermission.address ||
                        value.instantiatePermission.addresses
                      }
                    />
                    <ViewPermissionAddresses
                      permissionAddresses={
                        value.instantiatePermission.address ||
                        value.instantiatePermission.addresses
                      }
                    />
                  </Flex>
                ),
              },
            ]
          : []),
        {
          title: "Wasm Byte Code",
          html: (
            <Text className="ellipsis" maxWidth="180px">
              {value.wasmByteCode}
            </Text>
          ),
        },
      ];
    }
    case "wasm/MsgInstantiateContract":
      return [];
    case "wasm/MsgExecuteContract":
      return [];
    case "cosmos-sdk/MsgSend":
      return [];
    case "cosmos-sdk/MsgSubmitProposal":
      return [];
    // case "wasm/MsgInstantiateContract": {
    //   const [codeId, contractAddr] = log
    //     ? [
    //         findAttribute([log], "instantiate", "code_id").value,
    //         findAttribute([log], "instantiate", "_contract_address").value,
    //       ]
    //     : ["N/A", "N/A"];
    //   msgIcon = MdAdd;
    //   content = (
    //     <>
    //       Instantiate
    //       <ExplorerLink
    //         type="contract_address"
    //         value={contractAddr}
    //         canCopyWithHover
    //         textVariant="body1"
    //       />
    //       from
    //       <ExplorerLink
    //         type="code_id"
    //         value={codeId}
    //         canCopyWithHover
    //         textVariant="body1"
    //       />
    //     </>
    //   );
    // }
    // case "wasm/MsgExecuteContract":
    //   msgIcon = MdMessage;
    //   content = (
    //     <>
    //       Execute
    //       <span style={{ fontWeight: 700 }}>
    //         {Object.keys(value.msg).at(0)}
    //       </span>
    //       on
    //       <ExplorerLink
    //         type="contract_address"
    //         value={value.contract}
    //         canCopyWithHover
    //         textVariant="body1"
    //       />
    //     </>
    //   );
    // case "cosmos-sdk/MsgSend": {
    //   const toAddress = value.to_address as Addr;
    //   msgIcon = MdSend;
    //   content = (
    //     <>
    //       Send assets to
    //       <ExplorerLink
    //         type={getAddressType(toAddress)}
    //         value={toAddress}
    //         canCopyWithHover
    //         textVariant="body1"
    //       />
    //     </>
    //   );
    // }
    // case "cosmos-sdk/MsgSubmitProposal": {
    //   const proposalId = log
    //     ? findAttribute([log], "submit_proposal", "proposal_id").value
    //     : "N/A";
    //   msgIcon = MdMail;
    //   content = (
    //     <>
    //       Submit Proposal ID
    //       <ExplorerLink
    //         type="proposal_id"
    //         value={proposalId}
    //         canCopyWithHover
    //         textVariant="body1"
    //       />
    //     </>
    //   );
    // }
    default:
      return [];
  }
};

export const TxMsgDetails = ({ isExpand, ...txMsgData }: TxMsgDetailsProps) => {
  const getAddressType = useGetAddressType();
  const receipts = getReceipts(txMsgData, getAddressType);
  return (
    <Flex
      direction="column"
      gap={6}
      pt={4}
      height={isExpand ? "full" : 0}
      transition="all .25s ease-in-out"
    >
      <TxReceiptRender variant="tx-page" receipts={receipts} />
    </Flex>
  );
};
