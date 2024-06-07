import type { ProposalDetailsQueryParams } from "../../types";
import { useGovConfig, useTierConfig } from "lib/app-provider";

import { ProposalDetailsBodyFull } from "./full";
import { ProposalDetailsBodyLite } from "./lite";

export const ProposalDetailsBody = (props: ProposalDetailsQueryParams) => {
  useGovConfig({ shouldRedirect: true });
  const tier = useTierConfig();

  return tier === "full" ? (
    <ProposalDetailsBodyFull {...props} />
  ) : (
    <ProposalDetailsBodyLite {...props} />
  );
};
