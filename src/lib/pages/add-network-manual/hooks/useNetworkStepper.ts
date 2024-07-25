import { useRouter } from "next/router";
import { useEffect } from "react";

import { useCelatoneApp } from "lib/app-provider";

export const useNetworkStepper = (limit: number, handleSubmit: () => void) => {
  const router = useRouter();
  const currentStep = router.query.step;
  const { currentChainId } = useCelatoneApp();

  useEffect(() => {
    if (!router.isReady) return;
    const { step } = router.query;

    if (step) return;

    router.push(
      {
        query: {
          network: currentChainId,
          step: 1,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [router, router.isReady, currentChainId]);

  const handleNext = () =>
    currentStep && Number(currentStep) < limit
      ? router.push(
          {
            query: {
              network: currentChainId,
              step: Number(currentStep) + 1,
            },
          },
          undefined,
          { shallow: true }
        )
      : handleSubmit();

  const handlePrevious = () =>
    currentStep && Number(currentStep) > 1 ? router.back() : null;

  return {
    currentStep: Number(currentStep) - 1,
    handleNext,
    handlePrevious,
  };
};
