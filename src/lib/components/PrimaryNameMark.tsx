import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

export const PrimaryNameMark = () => (
  <Tooltip label="Primary name">
    <CustomIcon name="star-solid" color="accent.main" boxSize={3} m={0} />
  </Tooltip>
);
