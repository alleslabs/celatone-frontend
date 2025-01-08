/* eslint-disable sonarjs/cognitive-complexity */
import type { ChainConfig } from "@alleslabs/shared";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { zAddNetworkLinkChainConfigJson } from "../types";
import { useChainConfigs } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { EmptyState } from "lib/components/state";
import { useLocalChainConfigStore } from "lib/providers/store";
import { libDecode } from "lib/utils";

type AddCustomNetworkError =
  | {
      message: string;
      type: "invalid_config";
    }
  | {
      type: "chain_exists";
    }
  | {
      type: "no_config";
    }
  | { type: "no_error" };

export const AddNetworkLink = observer(() => {
  const router = useRouter();
  const [json, setJson] = useState<ChainConfig | null>(null);
  const [error, setError] = useState<AddCustomNetworkError>({
    type: "no_error",
  });
  const { isChainIdExist } = useChainConfigs();
  const { addLocalChainConfig, getLocalChainConfig } =
    useLocalChainConfigStore();

  // Automatically populate, validate and add config if query param is present
  useEffect(() => {
    if (
      !router.query.config ||
      typeof router.query.config !== "string" ||
      !router.query.config.trim().length
    ) {
      setError({ type: "no_config" });
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
          setError({
            message: validated.error.message,
            type: "invalid_config",
          });
          return;
        }

        const { data: validatedData } = validated;
        if (isChainIdExist(validatedData.chainId)) {
          setJson(validatedData);
          setError({ type: "chain_exists" });
          return;
        }

        addLocalChainConfig(validatedData.chainId, validatedData);
        setJson(validatedData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setError({
          message: "An unknown error occurred",
          type: "invalid_config",
        });
      }
    };

    validateAndAddConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.config]);

  // Automatically redirect to the added chain
  useEffect(() => {
    if (!json) return;
    const addedChain = getLocalChainConfig(json.chainId);

    if (addedChain && error.type === "no_error") {
      window.location.href = `/${addedChain.chainId}`;
    }
  }, [getLocalChainConfig, json, error.type, router]);

  if (error.type !== "no_error")
    return (
      <Flex
        style={{ height: "calc(100vh - 140px)" }}
        alignItems="center"
        px={10}
        justifyContent="center"
      >
        {error.type === "no_config" && (
          <EmptyState
            heading="No config provided"
            imageVariant="error"
            message="There are no network config provided with the link."
          />
        )}
        {error.type === "chain_exists" && (
          <EmptyState
            heading={`${json?.chainId} is already added`}
            imageVariant="error"
            py={0}
          >
            <Text variant="body2" color="text.dark">
              You can access {json?.chainId} in InitiaScan through
              <Link href={`/${json?.chainId}`}>
                <Text display="inline-flex" mx={1} color="primary.main">
                  this link
                </Text>
              </Link>
            </Text>
          </EmptyState>
        )}
        {error.type === "invalid_config" && (
          <EmptyState
            heading={`There is an error adding ${json?.chainId ?? "custom network"} to InitiaScan`}
            imageVariant="error"
            message="The provided configuration is invalid. Here is the error log"
            py={0}
          >
            <Box maxW="70%" minW="40%">
              <TextReadOnly text={error.message} canCopy />
            </Box>
            <Text mt={6}>You can add this custom Minitia manually</Text>
            <AppLink href="/custom-network/add">
              <Button
                mt={2}
                variant="outline-gray"
                leftIcon={<CustomIcon name="plus" />}
              >
                Add custom minitia
              </Button>
            </AppLink>
          </EmptyState>
        )}
      </Flex>
    );

  return <LoadingOverlay />;
});
