import { useAmplitudeInit } from "lib/amplitude";

export const AmplitudeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useAmplitudeInit();

  return <>{children}</>;
};
