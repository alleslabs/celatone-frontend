import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

export const PrimaryNameMark = () => (
  <Tooltip label="Primary name">
    <div style={{ display: "flex" }}>
      <CustomIcon name="star-solid" color="accent.main" boxSize={3} m={0} />
    </div>
  </Tooltip>
);
