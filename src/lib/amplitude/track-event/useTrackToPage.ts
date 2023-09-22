import { track } from "@amplitude/analytics-browser";
import { useCallback } from "react";

import { AmpEvent } from "../types";

import { useMandatoryProperties } from "./useMandatoryProperties";

export const useTrackToPage = () => {
  const mandatoryProperties = useMandatoryProperties();

  const trackToQuery = useCallback(
    (contract: boolean, msg: boolean) =>
      track(AmpEvent.TO_QUERY, {
        ...mandatoryProperties,
        contract,
        msg,
      }),
    [mandatoryProperties]
  );

  const trackToExecute = useCallback(
    (contract: boolean, msg: boolean) =>
      track(AmpEvent.TO_EXECUTE, {
        ...mandatoryProperties,
        contract,
        msg,
      }),
    [mandatoryProperties]
  );

  const trackToInstantiate = useCallback(
    (msg: boolean, codeId: boolean, section?: string) =>
      track(AmpEvent.TO_INSTANTIATE, {
        ...mandatoryProperties,
        codeId,
        msg,
        section,
      }),
    [mandatoryProperties]
  );

  const trackToMigrate = useCallback(
    (contract: boolean, codeId: boolean) =>
      track(AmpEvent.TO_MIGRATE, {
        ...mandatoryProperties,
        codeId,
        contract,
      }),
    [mandatoryProperties]
  );

  const trackToAdminUpdate = useCallback(
    (contract: boolean) =>
      track(AmpEvent.TO_ADMIN_UPDATE, {
        ...mandatoryProperties,
        contract,
      }),
    [mandatoryProperties]
  );

  return {
    trackToQuery,
    trackToExecute,
    trackToInstantiate,
    trackToMigrate,
    trackToAdminUpdate,
  };
};
