import { Flex, Icon, Text, Grid, useDisclosure, Tag } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  MdCheck,
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

import { MultipleActionMsgType } from "lib/components/actionMsg/MultipleActionMsgType";
import { SingleActionMsgType } from "lib/components/actionMsg/SingleActionMsgType";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { MsgDetail } from "lib/components/table/MsgDetail";
import { SingleMsg } from "lib/pages/pastTxs/components/SingleMsg";
import type { AllTransaction } from "lib/types";
import { ActionMsgType } from "lib/types";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

interface TxsTableRowProps {
  transaction: AllTransaction;
  templateColumnsStyle: string;
}

export const TxsTableRow = ({
  transaction,
  templateColumnsStyle,
}: TxsTableRowProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const [isAccordion, setIsAccordion] = useState(false);

  useEffect(() => {
    if (transaction.messages.length > 1) setIsAccordion(true);
  }, [transaction.messages]);

  const renderActionsMessages = () => {
    if (transaction.actionMsgType === ActionMsgType.SINGLEACTIONMSG) {
      return (
        <SingleActionMsgType
          messages={transaction.messages}
          type={extractMsgType(transaction.messages[0].type)}
          success={transaction.success}
        />
      );
    }
    if (transaction.actionMsgType === ActionMsgType.MULTIPLEACTIONMSG) {
      return <MultipleActionMsgType messages={transaction.messages} />;
    }
    return (
      <SingleMsg
        type="Message"
        tags={
          transaction.messages.length === 1
            ? [extractMsgType(transaction.messages[0].type)?.substring(3)]
            : [transaction.messages.length.toString()]
        }
      />
    );
  };

  return (
    <>
      <Grid
        templateColumns={templateColumnsStyle}
        onClick={onToggle}
        _hover={{ background: "divider.main" }}
      >
        <TableRow>
          <ExplorerLink
            value={transaction.hash.toLocaleUpperCase()}
            type="tx_hash"
            canCopyWithHover
          />
        </TableRow>
        <TableRow>
          <Icon
            as={transaction.success ? MdCheck : MdClose}
            fontSize="24px"
            color={transaction.success ? "success.main" : "error.main"}
          />
        </TableRow>
        <TableRow>
          <Flex gap={1} flexWrap="wrap">
            {renderActionsMessages()}
            {transaction.isIbc && (
              <Tag borderRadius="full" bg="rgba(164, 133, 231, 0.6)">
                IBC
              </Tag>
            )}
          </Flex>
        </TableRow>

        <TableRow>
          <ExplorerLink
            value={transaction.sender}
            type="user_address"
            canCopyWithHover
          />
        </TableRow>
        <TableRow>
          <ExplorerLink
            value={transaction.height.toString()}
            type="block_height"
            canCopyWithHover
          />
        </TableRow>
        <TableRow>
          <Flex direction="column" gap={1}>
            <Text variant="body2">{formatUTC(transaction.created)}</Text>
            <Text variant="body2" color="text.dark">
              {`(${dateFromNow(transaction.created)})`}
            </Text>
          </Flex>
        </TableRow>
        <TableRow>
          {isAccordion && !isOpen && <MdKeyboardArrowDown />}
          {isAccordion && isOpen && <MdKeyboardArrowUp />}
        </TableRow>
      </Grid>
      {isAccordion && (
        <Grid w="full" py={4} hidden={!isOpen}>
          {transaction.messages.map((msg, index) => (
            <MsgDetail key={index.toString() + msg.type} message={msg} />
          ))}
        </Grid>
      )}
    </>
  );
};
