import type { WasmVerifyRequest } from "lib/services/types";
import type { BechAddr32, Option, WasmVerifyStatus } from "lib/types";

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
import { useCelatoneApp } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
        <Flex alignItems="center" direction="row" gap={2} w="full">
          <CustomIcon boxSize={6} color="gray.600" name="verification-solid" />
          <Heading as="h5" variant="h5">
            Verify & Publish source code
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
            <Flex alignItems="center" gap={0.5}>
              <CustomIcon color="success.main" name="check" />
              <Text variant="body2">
                Access its source code via provided GitHub repository
              </Text>
            </Flex>
            <Flex alignItems="center" gap={0.5}>
              <CustomIcon color="success.main" name="check" />
              <Text variant="body2">
                Execute it through Scan&apos;s system-generated schema
              </Text>
            </Flex>
          </Flex>
          <Divider borderColor="gray.700" />
          <Flex direction="column" gap={6}>
            <Flex gap={6}>
              <Flex alignItems="center" gap={2}>
                <Text color="text.dark" fontWeight={500} variant="body2">
                  Code ID:
                </Text>
                <ExplorerLink
                  rightIcon={
                    <WasmVerifyBadge
                      linkedCodeId={contractAddress ? codeId : undefined}
                      relatedVerifiedCodes={relatedVerifiedCodes}
                      status={wasmVerifyStatus}
                    />
                  }
                  showCopyOnHover
                  type="code_id"
                  value={codeId.toString()}
                />
                {contractAddress && (
                  <Text>
                    (via{" "}
                    <ExplorerLink
                      showCopyOnHover
                      type="contract_address"
                      value={contractAddress}
                    />
                    )
                  </Text>
                )}
              </Flex>
              {codeHash && (
                <Flex alignItems="center" gap={2}>
                  <Text color="text.dark" fontWeight={500} variant="body2">
                    Code hash:
                  </Text>
                  <CopyLink
                    amptrackSection="code_hash"
                    isTruncate
                    showCopyOnHover
                    type="code_hash"
                    value={codeHash.toUpperCase()}
                  />
                </Flex>
              )}
            </Flex>
            <ControllerInput
              control={control}
              error={errors.gitUrl?.message}
              isRequired
              label="GitHub Repository URL:"
              labelBgColor="gray.800"
              name="gitUrl"
              placeholder="e.g. https://github.com/username/repository"
              variant="fixed-floating"
            />
            <ControllerInput
              control={control}
              error={errors.commit?.message}
              isRequired
              label="Commit hash:"
              labelBgColor="gray.800"
              name="commit"
              placeholder="e.g. a1b2c3d4e5f67890abcdef1234567890abcdef12"
              variant="fixed-floating"
            />
            <ControllerInput
              control={control}
              error={errors.packageName?.message}
              helperText="This should be the same name that is specified in Cargo.toml"
              isRequired
              label="Packages name:"
              labelBgColor="gray.800"
              name="packageName"
              placeholder="e.g. contract-name"
              variant="fixed-floating"
            />
            <WasmVerifySubmitFormSelect
              control={control}
              name="compilerVersion"
              options={wasmOptimizerVersions}
            />
          </Flex>
          <Button
            isDisabled={!isValid}
            isLoading={isLoading}
            variant="primary"
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
          <Text color="text.dark" textAlign="center" variant="body2">
            The verification process could take several hours depending on code
            complexity. Please ensure your input is accurate to prevent failure.
          </Text>
        </Flex>
      </ModalBody>
    </>
  );
};
