import axios from "axios";

import type {
  AccountAddr,
  ResponseModule,
  ResponseModules,
  InternalModule,
  HexAddr,
} from "lib/types";
import { snakeToCamel } from "lib/utils";

interface ModuleReturn {
  module: ResponseModule;
}

export const getAccountModules = async (
  baseEndpoint: string,
  address: AccountAddr
): Promise<InternalModule[]> => {
  const { data } = await axios.get<ResponseModules>(
    `${baseEndpoint}/initia/move/v1/accounts/${address}/modules`
  );
  // Implement LCD pagination
  return snakeToCamel(data.modules);
};

export const getAccountModule = async (
  baseEndpoint: string,
  address: AccountAddr,
  moduleName: string
): Promise<InternalModule> => {
  const { data } = await axios.get<ModuleReturn>(
    `${baseEndpoint}/initia/move/v1/accounts/${address}/modules/${moduleName}`
  );
  return snakeToCamel(data.module);
};

interface ModuleVerificationReturn {
  id: number;
  module_address: HexAddr;
  module_name: string;
  verified_at: string;
  digest: string;
  source: string;
  base64: string;
  chain_id: string;
}

export const getModuleVerificationStatus = async (
  address: AccountAddr,
  moduleName: string
): Promise<boolean> =>
  // TODO: move url to base api route? wait for celatone api implementation?
  axios
    .get<ModuleVerificationReturn>(
      `https://stone-compiler.initia.tech/contracts/${address}/${moduleName}`
    )
    .then(() => true)
    .catch(() => false);
