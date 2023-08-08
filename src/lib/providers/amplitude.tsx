import { useAmplitude, useCelatoneApp } from "lib/app-provider";

export const AmplitudeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    chainConfig: { registryChainName },
  } = useCelatoneApp();

  // TODO: revisit new structure later
  useAmplitude(registryChainName);

  return <>{children}</>;
};
