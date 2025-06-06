import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig } from "lib/app-provider";
import { InvalidState } from "lib/components/state";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { useRouter } from "next/router";
import { useEffect } from "react";

import {
  ValidatorDetailsBodyFull,
  ValidatorDetailsBodyLite,
} from "./components";
import { zValidatorDetailsQueryParams } from "./types";

const ValidatorDetails = () => {
  const router = useRouter();
  useGovConfig({ shouldRedirect: true });

  const validated = zValidatorDetailsQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_VALIDATOR_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      {!validated.success ? (
        <InvalidState title="Validator does not exist" />
      ) : (
        <TierSwitcher
          full={<ValidatorDetailsBodyFull {...validated.data} />}
          lite={<ValidatorDetailsBodyLite {...validated.data} />}
        />
      )}
    </>
  );
};

export default ValidatorDetails;
