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
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCelatoneApp } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { WasmVerifyRequest } from "lib/services/types";
import type { BechAddr32, Option, WasmVerifyStatus } from "lib/types";

import { useWasmOptimizerVersions } from "./hooks";
import { WasmVerifySubmitFormSelect } from "./WasmVerifySubmitFormSelect";

interface WasmVerifySubmitFormProps {
  codeId: number;
  codeHash: Option<string>;
  wasmVerifyStatus: WasmVerifyStatus;
  relatedVerifiedCodes?: number[];
  contractAddress?: BechAddr32;
  onSubmit: (wasmVerifyRequest: WasmVerifyRequest) => void;
  isLoading: boolean;
}

export const WasmVerifySubmitForm = ({
  codeId,
  codeHash,
  wasmVerifyStatus,
  relatedVerifiedCodes,
  contractAddress,
  onSubmit,
  isLoading,
}: WasmVerifySubmitFormProps) => {
  const { currentChainId } = useCelatoneApp();
  const wasmOptimizerVersions = useWasmOptimizerVersions();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        gitUrl: z
          .string()
          .min(1, {
            message: "Please provide the source code’s GitHub commit URL",
          })
          .regex(
            /^https:\/\/github\.com\/[^/]+\/[^/]+$/,
            "Please enter GitHub URL in format: https://github.com/username/repository"
          )
          .url({
            message:
              "Please enter GitHub URL in format: https://github.com/username/repository",
          }),
        commit: z
          .string()
          .min(1, { message: "Commit hash is required" })
          .regex(
            /^[0-9a-fA-F]+$/,
            "Only hexadecimal digits are allowed, such as 0-9 and A-F"
          )
          .max(40, {
            message: "The commit hash length must be 40 characters or fewer",
          }),
        packageName: z
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
      gitUrl: "",
      commit: "",
      packageName: "",
      compilerVersion: "",
    },
  });

  return (
    <>
      <ModalHeader pb={0}>
        <Flex w="full" direction="row" alignItems="center" gap={2}>
          <CustomIcon name="verification-solid" boxSize={6} color="gray.600" />
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
                <ExplorerLink
                  type="code_id"
                  value={codeId.toString()}
                  rightIcon={
                    <WasmVerifyBadge
                      status={wasmVerifyStatus}
                      relatedVerifiedCodes={relatedVerifiedCodes}
                      linkedCodeId={contractAddress ? codeId : undefined}
                    />
                  }
                  showCopyOnHover
                />
                {contractAddress && (
                  <Text>
                    (via{" "}
                    <ExplorerLink
                      type="contract_address"
                      value={contractAddress}
                      showCopyOnHover
                    />
                    )
                  </Text>
                )}
              </Flex>
              {codeHash && (
                <Flex gap={2} alignItems="center">
                  <Text fontWeight={500} color="text.dark" variant="body2">
                    Code Hash:
                  </Text>
                  <CopyLink
                    type="code_hash"
                    amptrackSection="code_hash"
                    value={codeHash.toUpperCase()}
                    isTruncate
                    showCopyOnHover
                  />
                </Flex>
              )}
            </Flex>
            <ControllerInput
              name="gitUrl"
              control={control}
              label="GitHub Repository URL:"
              labelBgColor="gray.800"
              variant="fixed-floating"
              placeholder="e.g. https://github.com/username/repository"
              isRequired
              error={errors.gitUrl?.message}
            />
            <ControllerInput
              name="commit"
              control={control}
              label="Commit Hash:"
              labelBgColor="gray.800"
              variant="fixed-floating"
              placeholder="e.g. a1b2c3d4e5f67890abcdef1234567890abcdef12"
              isRequired
              error={errors.commit?.message}
            />
            <ControllerInput
              name="packageName"
              control={control}
              label="Packages Name:"
              labelBgColor="gray.800"
              variant="fixed-floating"
              placeholder="e.g. contract-name"
              helperText="This should be the same name that is specified in Cargo.toml"
              isRequired
              error={errors.packageName?.message}
            />
            <WasmVerifySubmitFormSelect
              name="compilerVersion"
              control={control}
              options={wasmOptimizerVersions}
            />
          </Flex>
          <Button
            variant="primary"
            isDisabled={!isValid}
            isLoading={isLoading}
            onClick={handleSubmit((data) => {
              onSubmit({
                chainId: currentChainId,
                codeId,
                ...data,
              });
            })}
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
