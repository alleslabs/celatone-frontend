import { amp } from "../Amplitude";
import { AmpEvent } from "../types";

export const trackToQuery = (contract: boolean, msg: boolean) =>
  amp.track(AmpEvent.TO_QUERY, {
    contract,
    msg,
  });

export const trackToExecute = (contract: boolean, msg: boolean) =>
  amp.track(AmpEvent.TO_EXECUTE, {
    contract,
    msg,
  });

export const trackToInstantiate = (
  msg: boolean,
  codeId: boolean,
  section?: string
) =>
  amp.track(AmpEvent.TO_INSTANTIATE, {
    codeId,
    msg,
    section,
  });

export const trackToMigrate = (contract: boolean, codeId: boolean) =>
  amp.track(AmpEvent.TO_MIGRATE, {
    codeId,
    contract,
  });

export const trackToAdminUpdate = (contract: boolean) =>
  amp.track(AmpEvent.TO_ADMIN_UPDATE, {
    contract,
  });

export const trackToModuleInteraction = (
  address: boolean,
  moduleName: boolean,
  isVerify: boolean,
  functionName: boolean,
  functionType?: string
) =>
  amp.track(AmpEvent.TO_MODULE_INTERACTION, {
    address,
    functionName,
    functionType,
    isVerify,
    moduleName,
  });
