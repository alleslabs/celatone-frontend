import axios from "axios";
import { z } from "zod";

import { zProjectInfo, zPublicAccountInfo } from "lib/types";

const zIcns = z.object({
  names: z.array(z.string()),
  primary_name: z.string(),
});

const zAccountInfo = z
  .object({
    icns: zIcns.nullable(),
    project_info: zProjectInfo.nullable(),
    public_info: zPublicAccountInfo.nullable(),
  })
  .transform((accountInfo) => ({
    icns: accountInfo.icns,
    projectInfo: accountInfo.project_info,
    publicInfo: accountInfo.public_info,
  }));

export type AccountInfo = z.infer<typeof zAccountInfo>;

export const getAccountInfo = async (
  endpoint: string,
  address: string
): Promise<AccountInfo> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/info`)
    .then((res) => zAccountInfo.parse(res.data));
