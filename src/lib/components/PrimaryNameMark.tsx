import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

export const PrimaryNameMark = ({ boxSize = 3 }: { boxSize?: number }) => (
  <Tooltip label="Primary name">
    <CustomIcon
      name="star-solid"
      color="secondary.main"
      boxSize={boxSize}
      m={0}
    />
  </Tooltip>
);
