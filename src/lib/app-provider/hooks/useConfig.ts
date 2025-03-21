import type { ChainConfig } from "@alleslabs/shared";

import { TierMap } from "lib/types";

import { useInternalNavigate } from "./useInternalNavigate";
import { useCelatoneApp } from "../contexts";

export const useTierConfig = (
  {
    minTier,
  }: {
    minTier: ChainConfig["tier"];
  } = {
    minTier: "lite",
  }
) => {
  const {
    chainConfig: { tier },
  } = useCelatoneApp();
  const navigate = useInternalNavigate();

  if (TierMap[tier] < TierMap[minTier])
    navigate({ pathname: "/", replace: true });

  return {
    tier,
    isFullTier: tier === "full",
    isLiteTier: tier === "lite",
    isMesaTier: tier === "mesa",
    isSequencerTier: tier === "sequencer",
  };
};

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

export const useMoveConfig = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const {
    chainConfig: {
      features: { move },
    },
  } = useCelatoneApp();

  return useBaseConfig({ feature: move, shouldRedirect });
};

export const useEvmConfig = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const {
    chainConfig: {
      features: { evm },
    },
  } = useCelatoneApp();

  return useBaseConfig({ feature: evm, shouldRedirect });
};

export const useNftConfig = ({
  shouldRedirect,
}: {
  shouldRedirect: boolean;
}) => {
  const {
    chainConfig: {
      features: { nft },
    },
  } = useCelatoneApp();

  return useBaseConfig({ feature: nft, shouldRedirect });
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
