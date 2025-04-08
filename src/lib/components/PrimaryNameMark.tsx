import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

export const PrimaryNameMark = ({ boxSize = 3 }: { boxSize?: number }) => (
  <Tooltip label="Primary name">
    <CustomIcon
      boxSize={boxSize}
      color="secondary.main"
      m={0}
      name="star-solid"
    />
  </Tooltip>
);
