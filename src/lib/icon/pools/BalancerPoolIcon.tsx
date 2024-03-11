import { Icon } from "@chakra-ui/react";
import type { IconProps } from "@chakra-ui/react";

import { CURR_THEME } from "env";

export const BalancerPoolIcon = (props: IconProps) => (
  <Icon viewBox="0 0 25 25" {...props}>
    <path
      d="M1.65441 12.6804C1.20698 12.6804 0.855771 13.0574 0.913503 13.502C1.28396 16.2034 2.57814 18.6051 4.46889 20.3787C4.75756 20.6493 5.2098 20.63 5.48884 20.3449L13.124 12.6804H1.65441Z"
      fill={CURR_THEME.colors.primary.darker}
    />
    <path
      d="M25 12.4016C25 6.53975 20.6652 1.68786 15.0411 0.914655C14.5984 0.851831 14.2232 1.20944 14.2232 1.65887V13.1749L6.69384 20.7378C6.3715 21.0616 6.39555 21.5932 6.76601 21.8541C8.65195 23.2072 10.9613 23.9998 13.4534 23.9998C19.8281 23.9998 25 18.8096 25 12.4016Z"
      fill={CURR_THEME.colors.primary.main}
    />
    <path
      d="M13.1509 0.802205V11.5981H2.40293C1.96993 11.5981 1.60429 11.2599 1.60429 10.8249C1.60429 4.84705 6.4298 0 12.3811 0C12.8141 0 13.1509 0.367274 13.1509 0.802205Z"
      fill={CURR_THEME.colors.primary.lighter}
    />
  </Icon>
);
