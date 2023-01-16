import {
  Flex,
  Icon,
  Text,
  Grid,
  useDisclosure,
  Tag,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdCheck, MdClose, MdKeyboardArrowDown } from "react-icons/md";

import { MultipleActionsMsg } from "lib/components/action-msg/MultipleActionsMsg";
import { SingleActionMsg } from "lib/components/action-msg/SingleActionMsg";
import { SingleMsg } from "lib/components/action-msg/SingleMsg";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { MsgDetail } from "lib/components/table/MsgDetail";
import type { AllTransaction } from "lib/types";
import { ActionMsgType } from "lib/types";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

const RenderActionsMessages = ({
  transaction,
}: {
  transaction: AllTransaction;
}) => {
  if (transaction.actionMsgType === ActionMsgType.SINGLE_ACTION_MSG) {
    return (
      <SingleActionMsg
        messages={transaction.messages}
        type={extractMsgType(transaction.messages[0].type)}
        success={transaction.success}
      />
    );
  }
  if (transaction.actionMsgType === ActionMsgType.MULTIPLE_ACTION_MSG) {
    return <MultipleActionsMsg messages={transaction.messages} />;
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

  return (
    <Box w="full" minW="min-content">
      <Grid
        templateColumns={templateColumnsStyle}
        onClick={isAccordion ? onToggle : undefined}
        _hover={{ background: "divider.main" }}
        cursor={isAccordion ? "pointer" : "none"}
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
            <RenderActionsMessages transaction={transaction} />
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
            <Text variant="body3">{formatUTC(transaction.created)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(transaction.created)})`}
            </Text>
          </Flex>
        </TableRow>
        <TableRow>
          {isAccordion && (
            <Icon
              as={MdKeyboardArrowDown}
              transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
              boxSize="18px"
            />
          )}
        </TableRow>
      </Grid>
      {isAccordion && (
        <Grid w="full" py={4} hidden={!isOpen}>
          {transaction.messages.map((msg, index) => (
            <MsgDetail key={index.toString() + msg.type} message={msg} />
          ))}
        </Grid>
      )}
    </Box>
  );
};
