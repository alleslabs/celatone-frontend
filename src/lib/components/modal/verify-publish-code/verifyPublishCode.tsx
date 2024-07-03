import {
  Button,
  Divider,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { sortBy } from "lodash";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { useDockerImageTag } from "lib/services/docker-image";

import { VerifyPublishCodeSelectInput } from "./verifyPublishCodeSelectInput";

interface VerifyPublishCodeProps {
  codeId: string;
  codeHash: string;
  contractAddress?: string;
  onSubmitVerifyPublishCode: () => void;
}

export const VerifyPublishCode = ({
  codeId,
  codeHash,
  contractAddress,
  onSubmitVerifyPublishCode,
}: VerifyPublishCodeProps) => {
  const { data: rustOptimizer } = useDockerImageTag(
    "cosmwasm",
    "rust-optimizer"
  );
  const { data: rustOptimizerArm64 } = useDockerImageTag(
    "cosmwasm",
    "rust-optimizer-arm64"
  );

  const options = useMemo(() => {
    const rustOptimizerResult =
      rustOptimizer?.results.map((result) => ({
        label: `cosmwasm/optimizer:${result.name}`,
        value: result.digest,
        version: result.name,
      })) ?? [];
    const rustOptimizerArm64Result =
      rustOptimizerArm64?.results.map((result) => ({
        label: `cosmwasm/optimizer-arm64:${result.name}`,
        value: result.digest,
        version: result.name,
      })) ?? [];

    const results = [...rustOptimizerResult, ...rustOptimizerArm64Result];

    return sortBy(results, ["version"]).reverse();
  }, [rustOptimizer, rustOptimizerArm64]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        githubRepository: z
          .string()
          .min(1, {
            message: "Please provide the source code’s GitHub commit URL",
          })
          .regex(
            /^https:\/\/github\.com\/[A-Za-z0-9_.-]+$/,
            "Please enter GitHub URL in format: https://github.com/yourrepositoryname"
          )
          .url({
            message:
              "Please enter GitHub URL in format: https://github.com/yourrepositoryname",
          }),
        commitHash: z
          .string()
          .min(1, { message: "Commit hash is requried" })
          .regex(
            /^[0-9a-fA-F]+$/,
            "Only hexadecimal digits are allowed, such as 0-9 and A-F"
          )
          .max(40, {
            message: "The commit hash length must be 40 characters or fewer",
          }),
        wasmFileName: z
          .string()
          .min(1, { message: "Wasm file name is required" })
          .regex(
            /^[^\\/:*?"<>|]+$/,
            'Filename cannot contain any of the following characters: \\ / : * ? " < > |'
          ),
        compilerVersion: z.string().min(1),
      })
    ),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      githubRepository: "",
      commitHash: "",
      wasmFileName: "",
      compilerVersion: "",
    },
  });

  return (
    <>
      <ModalHeader pb={0}>
        <Flex w="full" direction="row" alignItems="center" gap={2}>
          <CustomIcon name="verification-solid" boxSize={8} color="gray.600" />
          <Heading variant="h5" as="h5">
            Verify & Publish Source Code
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="gray.400" />
      <ModalBody>
        <Flex direction="column" gap={4}>
          <Flex direction="column" gap={1}>
            <Text variant="body2">
              Verifying your code offers enhanced credibility with a verified
              badge. Once verified, users will able to...
            </Text>
            <Flex gap={0.5} alignItems="center">
              <CustomIcon name="check" color="success.main" />
              <Text variant="body2">
                Access its source code via provided GitHub repository
              </Text>
            </Flex>
            <Flex gap={0.5} alignItems="center">
              <CustomIcon name="check" color="success.main" />
              <Text variant="body2">
                Execute it through Celatone&apos;s system-generated schema
              </Text>
            </Flex>
          </Flex>
          <Divider borderColor="gray.700" />
          <Flex direction="column" gap={6}>
            <Flex gap={6}>
              <Flex gap={2} alignItems="center">
                <Text fontWeight={500} color="text.dark" variant="body2">
                  Code ID:
                </Text>
                <ExplorerLink type="code_id" value={codeId} showCopyOnHover />
                {contractAddress && (
                  <Text>
                    (via{" "}
                    <ExplorerLink
                      type="tx_hash"
                      value={contractAddress}
                      showCopyOnHover
                    />
                    )
                  </Text>
                )}
              </Flex>
              <Flex gap={2} alignItems="center">
                <Text fontWeight={500} color="text.dark" variant="body2">
                  Code Hash:
                </Text>
                <ExplorerLink type="tx_hash" value={codeHash} showCopyOnHover />
              </Flex>
            </Flex>
            <ControllerInput
              name="githubRepository"
              control={control}
              label="GitHub Repository URL:"
              labelBgColor="gray.800"
              variant="fixed-floating"
              placeholder="e.g. https://github.com/initiascan/"
              helperText="Please provide the source code’s GitHub commit URL"
              rules={{
                required: "",
              }}
              error={errors.githubRepository?.message}
            />
            <ControllerInput
              name="commitHash"
              control={control}
              label="Commit Hash:"
              labelBgColor="gray.800"
              variant="fixed-floating"
              placeholder="e.g. a1b2c3d4e5f67890abcdef1234567890abcdef12"
              rules={{
                required: "",
              }}
              error={errors.commitHash?.message}
            />
            <Flex gap={4} alignItems="center">
              <ControllerInput
                name="wasmFileName"
                control={control}
                label="Wasm File Name:"
                labelBgColor="gray.800"
                variant="fixed-floating"
                placeholder="e.g. initia_contract"
                rules={{
                  required: "",
                }}
                error={errors.wasmFileName?.message}
              />
              <Text color="text.dark" variant="body1">
                .wasm
              </Text>
            </Flex>
            <VerifyPublishCodeSelectInput
              name="compilerVersion"
              control={control}
              options={options}
            />
          </Flex>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmitVerifyPublishCode)}
            isDisabled={!isValid}
          >
            Verify & Publish
          </Button>
          <Text variant="body2" color="text.dark" textAlign="center">
            The verification process could take several hours depending on code
            complexity. Please ensure your input is accurate to prevent failure.
          </Text>
        </Flex>
      </ModalBody>
    </>
  );
};
