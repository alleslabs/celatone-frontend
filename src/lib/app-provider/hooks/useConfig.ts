import { useCelatoneApp } from "../contexts";
import type { ChainConfig } from "config/chain/types";

import { useInternalNavigate } from "./useInternalNavigate";

type Features = ChainConfig["features"];

type FeatureVariant = Features[keyof Features];

interface BaseConfigArgs<Feature> {
  feature: Feature;
  shouldRedirect: boolean;
}

const useBaseConfig = <Feature extends FeatureVariant>({
  feature,
  shouldRedirect,
}: BaseConfigArgs<Feature>) => {
  const navigate = useInternalNavigate();

  if (!feature.enabled && shouldRedirect)
    navigate({ pathname: "/", replace: true });

  return feature;
};

export const useWasmConfig = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const {
    chainConfig: {
      features: { wasm },
    },
  } = useCelatoneApp();

  return useBaseConfig({ feature: wasm, shouldRedirect });
};

export const useFaucetConfig = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const {
    chainConfig: {
      features: { faucet },
    },
  } = useCelatoneApp();

  return useBaseConfig({ feature: faucet, shouldRedirect });
};

export const usePoolConfig = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const {
    chainConfig: {
      features: { pool },
    },
  } = useCelatoneApp();

  return useBaseConfig({ feature: pool, shouldRedirect });
};

export const usePublicProjectConfig = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const {
    chainConfig: {
      features: { publicProject },
    },
  } = useCelatoneApp();

  return useBaseConfig({ feature: publicProject, shouldRedirect });
};

export const useGovConfig = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const {
    chainConfig: {
      features: { gov },
    },
  } = useCelatoneApp();

  return useBaseConfig({ feature: gov, shouldRedirect });
};
