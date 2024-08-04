import { useRouter } from "next/router";
import { useEffect } from "react";

import { useCelatoneApp } from "lib/app-provider";

export const useNetworkStepper = (limit: number, handleSubmit: () => void) => {
  const router = useRouter();
  const currentStep = router.query.step;
  const { currentChainId } = useCelatoneApp();

  useEffect(() => {
    if (Number(currentStep) === 1) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handlePrevious = () => router.back();

  return {
    currentStepIndex: Number(currentStep) - 1,
    handleNext,
    handlePrevious,
    hasNext: Number(currentStep) < limit,
    hasPrevious: Number(currentStep) > 1,
  };
};
