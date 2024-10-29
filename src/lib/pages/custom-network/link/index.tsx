/* eslint-disable sonarjs/cognitive-complexity */
import type { ChainConfig } from "@alleslabs/shared";
import { Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { zAddNetworkLinkChainConfigJson } from "../types";
import { useChainConfigs } from "lib/app-provider";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { useLocalChainConfigStore } from "lib/providers/store";
import { libDecode } from "lib/utils";

export const AddNetworkLink = observer(() => {
  const router = useRouter();
  const [json, setJson] = useState<ChainConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isChainIdExist, isPrettyNameExist } = useChainConfigs();
  const { addLocalChainConfig, getLocalChainConfig } =
    useLocalChainConfigStore();

  // Automatically populate, validate and add config if query param is present
  useEffect(() => {
    if (!router.query.config) {
      setError("No config provided");
      return;
    }

    const validateAndAddConfig = async () => {
      try {
        const decodedConfig = JSON.parse(
          libDecode(router.query.config as string)
        );
        const validated =
          await zAddNetworkLinkChainConfigJson.safeParseAsync(decodedConfig);

        if (!validated.success) {
          throw new Error(validated.error.message);
        }

        const { data: validatedData } = validated;
        if (
          isChainIdExist(validatedData.chainId) ||
          isPrettyNameExist(validatedData.prettyName)
        ) {
          throw new Error("Chain already exists");
        }
        addLocalChainConfig(validatedData.chainId, validatedData);
        setJson(validatedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    validateAndAddConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.config]);

  useEffect(() => {
    if (!json) return;
    const addedChain = getLocalChainConfig(json?.chainId);

    if (addedChain) {
      window.location.href = `/${json.chainId}`;
    }
  }, [getLocalChainConfig, json]);

  if (error)
    return (
      <Flex
        style={{ height: "calc(100vh - 140px)" }}
        justifyContent="center"
        alignItems="center"
        px={10}
      >
        <Text variant="body1" color="text.dark">
          {error}
        </Text>
      </Flex>
    );

  return <LoadingOverlay />;
});
