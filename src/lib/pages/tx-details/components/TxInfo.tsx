import type { FlexProps } from "@chakra-ui/react";
import { Text, chakra, Flex } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { TxData } from "lib/services/txService";

interface TxInfoProps extends FlexProps {
  txData: TxData;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    gap: 6,
    w: "250px",
  },
});

export const TxInfo = ({ txData, ...flexProps }: TxInfoProps) => {
  return (
    <Container {...flexProps}>
      <LabelText label="Network">{txData.chainId}</LabelText>
      <LabelText label="Block">
        <ExplorerLink
          value={txData.height.toString()}
          type="block_height"
          canCopyWithHover
        />
      </LabelText>
      <LabelText label="Transaction Fee">
        {txData.formattedFee || (
          <Text variant="body2" color="text.dark">
            No Fee
          </Text>
        )}
      </LabelText>
      <LabelText label="Gas Used/Requested">
        {`${txData.gasUsed}/${txData.gasWanted}`}
      </LabelText>
      <LabelText label="Memo">
        {txData.tx.value.memo || (
          <Text variant="body2" color="text.dark">
            No Memo
          </Text>
        )}
      </LabelText>
    </Container>
  );
};
