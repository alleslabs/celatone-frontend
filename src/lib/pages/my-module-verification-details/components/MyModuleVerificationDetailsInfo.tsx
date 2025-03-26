import { Flex, Grid, Text } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";
import type { MoveVerifyByTaskIdResponse } from "lib/services/types";
import type { MoveVerifyTaskLocalInfo } from "lib/stores/verify-module";
import type { Option } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { MyModuleVerificationDetailsStatusBadge } from "./MyModuleVerificationDetailsStatusBadge";

interface MyModuleVerificationDetailsInfoProps {
  verifyTaskLocalInfo: Option<MoveVerifyTaskLocalInfo>;
  verifyTaskInfo: MoveVerifyByTaskIdResponse;
}

export const MyModuleVerificationDetailsInfo = ({
  verifyTaskLocalInfo,
  verifyTaskInfo,
}: MyModuleVerificationDetailsInfoProps) => {
  const chainId =
    verifyTaskLocalInfo?.chainId ?? verifyTaskInfo.result?.chainId;
  const verifiedAt =
    verifyTaskLocalInfo?.verifiedAt ?? verifyTaskInfo.result?.verifiedAt;

  const languageVersion = verifyTaskInfo.info?.languageVersion;
  const compilerVersion = verifyTaskInfo.info?.compilerVersion;
  const bytecodeVersion = verifyTaskInfo.info?.bytecodeVersion;

  return (
    <Grid
      display="flex"
      columnGap={8}
      rowGap={2}
      flexWrap="wrap"
      border="1px"
      borderColor="gray.700"
      rounded={8}
      p={4}
    >
      {chainId && <LabelText label="Network">{chainId}</LabelText>}
      <LabelText label="Status">
        <MyModuleVerificationDetailsStatusBadge
          status={verifyTaskInfo.task.status}
        />
      </LabelText>
      {verifiedAt && (
        <LabelText label="Verified at">
          <Flex direction="column">
            <Text variant="body2" color="text.dark">
              {formatUTC(verifiedAt)}
            </Text>
            <Text variant="body3" color="text.disabled">
              ({dateFromNow(verifiedAt)})
            </Text>
          </Flex>
        </LabelText>
      )}
      {[
        { label: "Language Version", value: languageVersion },
        { label: "Compiler Version", value: compilerVersion },
        { label: "Bytecode Version", value: bytecodeVersion },
      ].map(({ label, value }) => (
        <LabelText key={label} label={label}>
          {value ? <Text variant="body2">{value}</Text> : "-"}
        </LabelText>
      ))}
    </Grid>
  );
};
