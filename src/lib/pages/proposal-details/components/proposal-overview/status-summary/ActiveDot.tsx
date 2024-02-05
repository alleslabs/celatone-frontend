import { MotionBox } from "lib/components/MotionBox";
import { ProposalStatus } from "lib/types";

interface ActiveDotProps {
  status: ProposalStatus;
}

export const ActiveDot = ({ status }: ActiveDotProps) =>
  status !== ProposalStatus.DEPOSIT_PERIOD &&
  status !== ProposalStatus.VOTING_PERIOD ? null : (
    <MotionBox
      boxSize={3}
      borderRadius="50%"
      bgColor="accent.main"
      animate={{ opacity: [1, 0, 1] }}
      // @ts-expect-error no problem in operation, although type error appears.
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    />
  );
