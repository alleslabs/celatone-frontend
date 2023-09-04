import axios from "axios";

import type {
  AccountAddr,
  ResponseModule,
  ResponseModules,
  InternalModule,
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
