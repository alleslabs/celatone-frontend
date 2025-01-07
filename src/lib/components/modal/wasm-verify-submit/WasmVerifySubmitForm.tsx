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
  codeHash: Option<string>;
  codeId: number;
  contractAddress?: BechAddr32;
  isLoading: boolean;
  onSubmit: (wasmVerifyRequest: WasmVerifyRequest) => void;
  relatedVerifiedCodes?: number[];
  wasmVerifyStatus: WasmVerifyStatus;
}

export const WasmVerifySubmitForm = ({
  codeHash,
  codeId,
  contractAddress,
  isLoading,
  onSubmit,
  relatedVerifiedCodes,
  wasmVerifyStatus,
}: WasmVerifySubmitFormProps) => {
  const { currentChainId } = useCelatoneApp();
  const wasmOptimizerVersions = useWasmOptimizerVersions();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    defaultValues: {
      commit: "",
      compilerVersion: "",
      gitUrl: "",
      packageName: "",
    },
    mode: "all",
    resolver: zodResolver(
      z.object({
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
        compilerVersion: z.string().min(1),
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
        packageName: z
          .string()
          .min(1, { message: "Wasm file name is required" })
          .regex(
            /^[^\\/:*?"<>|]+$/,
            'Filename cannot contain any of the following characters: \\ / : * ? " < > |'
          ),
      })
    ),
    reValidateMode: "onChange",
  });

  return (
    <>
      <ModalHeader pb={0}>
        <Flex alignItems="center" gap={2} w="full" direction="row">
          <CustomIcon name="verification-solid" boxSize={6} color="gray.600" />
          <Heading as="h5" variant="h5">
            Verify & Publish Source Code
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="gray.400" />
      <ModalBody>
        <Flex gap={4} direction="column">
          <Flex gap={1} direction="column">
            <Text variant="body2">
              Verifying your code offers enhanced credibility with a verified
              badge. Once verified, users will able to...
            </Text>
            <Flex alignItems="center" gap={0.5}>
              <CustomIcon name="check" color="success.main" />
              <Text variant="body2">
                Access its source code via provided GitHub repository
              </Text>
            </Flex>
            <Flex alignItems="center" gap={0.5}>
              <CustomIcon name="check" color="success.main" />
              <Text variant="body2">
                Execute it through Celatone&apos;s system-generated schema
              </Text>
            </Flex>
          </Flex>
          <Divider borderColor="gray.700" />
          <Flex gap={6} direction="column">
            <Flex gap={6}>
              <Flex alignItems="center" gap={2}>
                <Text variant="body2" color="text.dark" fontWeight={500}>
                  Code ID:
                </Text>
                <ExplorerLink
                  type="code_id"
                  value={codeId.toString()}
                  rightIcon={
                    <WasmVerifyBadge
                      status={wasmVerifyStatus}
                      linkedCodeId={contractAddress ? codeId : undefined}
                      relatedVerifiedCodes={relatedVerifiedCodes}
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
                <Flex alignItems="center" gap={2}>
                  <Text variant="body2" color="text.dark" fontWeight={500}>
                    Code Hash:
                  </Text>
                  <CopyLink
                    isTruncate
                    type="code_hash"
                    value={codeHash.toUpperCase()}
                    amptrackSection="code_hash"
                    showCopyOnHover
                  />
                </Flex>
              )}
            </Flex>
            <ControllerInput
              isRequired
              label="GitHub Repository URL:"
              name="gitUrl"
              variant="fixed-floating"
              control={control}
              error={errors.gitUrl?.message}
              labelBgColor="gray.800"
              placeholder="e.g. https://github.com/username/repository"
            />
            <ControllerInput
              isRequired
              label="Commit Hash:"
              name="commit"
              variant="fixed-floating"
              control={control}
              error={errors.commit?.message}
              labelBgColor="gray.800"
              placeholder="e.g. a1b2c3d4e5f67890abcdef1234567890abcdef12"
            />
            <ControllerInput
              helperText="This should be the same name that is specified in Cargo.toml"
              isRequired
              label="Packages Name:"
              name="packageName"
              variant="fixed-floating"
              control={control}
              error={errors.packageName?.message}
              labelBgColor="gray.800"
              placeholder="e.g. contract-name"
            />
            <WasmVerifySubmitFormSelect
              name="compilerVersion"
              control={control}
              options={wasmOptimizerVersions}
            />
          </Flex>
          <Button
            isDisabled={!isValid}
            variant="primary"
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
          <Text textAlign="center" variant="body2" color="text.dark">
            The verification process could take several hours depending on code
            complexity. Please ensure your input is accurate to prevent failure.
          </Text>
        </Flex>
      </ModalBody>
    </>
  );
};
