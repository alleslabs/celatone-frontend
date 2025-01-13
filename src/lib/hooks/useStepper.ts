import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export const useStepper = (
  total: number,
  handleSubmit: () => void,
  handleBack?: () => void
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStep = searchParams.get("step") ?? "1";

  useEffect(() => {
    if (Number(currentStep) === 1) return;
    const params = new URLSearchParams(searchParams);
    params.set("step", "1");
    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("step", String(Number(currentStep) + 1));

    return currentStep && Number(currentStep) < total
      ? router.replace(`${pathname}?${params.toString()}`)
      : handleSubmit();
  }, [currentStep, handleSubmit, total, pathname, router, searchParams]);

  const handlePrevious = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("step", String(Number(currentStep) - 1));

    return currentStep && Number(currentStep) > 1
      ? router.replace(`${pathname}?${params.toString()}`)
      : (handleBack?.() ?? router.back());
  }, [currentStep, pathname, router, searchParams, handleBack]);

  return {
    currentStepIndex: Number(currentStep) - 1,
    handleNext,
    handlePrevious,
    hasNext: Number(currentStep) < total,
    hasPrevious: Number(currentStep) > 1,
  };
};
