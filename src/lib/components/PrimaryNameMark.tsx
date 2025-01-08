import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

export const PrimaryNameMark = ({ boxSize = 3 }: { boxSize?: number }) => (
  <Tooltip label="Primary name">
    <CustomIcon
      m={0}
      name="star-solid"
      boxSize={boxSize}
      color="secondary.main"
    />
  </Tooltip>
);
