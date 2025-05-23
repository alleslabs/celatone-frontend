import type { ChainConfig } from "@alleslabs/shared";

import { getArchivalEndpoint } from "lib/services/utils";
import { TierMap } from "lib/types";

import { useCelatoneApp } from "../contexts";
import { useInternalNavigate } from "./useInternalNavigate";

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
    isFullTier: tier === "full",
    isLiteTier: tier === "lite",
    isMesaTier: tier === "mesa",
    isSequencerTier: tier === "sequencer",
    tier,
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

  // TODO: Remove this once new indexer is deployed
  const modifiedEvm: ChainConfig["features"]["evm"] = evm.enabled
    ? {
        enabled: true,
        jsonRpc: getArchivalEndpoint(evm.jsonRpc, evm.jsonRpc),
      }
    : {
        enabled: false,
      };

  return useBaseConfig({ feature: modifiedEvm, shouldRedirect });
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
