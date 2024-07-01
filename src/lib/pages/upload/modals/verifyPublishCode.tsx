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

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ControllerInput, SelectInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";

interface VerifyPublishCodeProps {
  onSubmitVerifyPublishCode: () => void;
}

export const VerifyPublishCode = ({
  onSubmitVerifyPublishCode,
}: VerifyPublishCodeProps) => {
  const {
    control,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        githubRepository: z
          .string()
          .min(1, {
            message: "Please provide the source code’s GitHub commit URL",
          })
          .url({
            message:
              "Please enter GitHub URL in format: https://github.com/yourrepositoryname",
          }),
        commitHash: z.string().min(1, { message: "Commit hash is requried" }),
        wasmFileName: z
          .string()
          .min(1, { message: "Wasm file name is required" })
          .regex(
            /^[^\\/:*?"<>|]+$/,
            'Filename cannot contain any of the following characters: \\ / : * ? " < > |'
          ),
        compilerVersion: z.string(),
      })
    ),
    defaultValues: {
      githubRepository: "",
      commitHash: "",
      wasmFileName: "",
      compilerVersion: "",
    },
  });
  // const { githubRepository, commitHash, wasmFileName, compilerVersion } =
  //   watch();

  return (
    <>
      <ModalHeader>
        <Flex w="full" direction="row" alignItems="center" gap={2}>
          <CustomIcon name="verification-solid" boxSize={8} color="gray.600" />
          <Heading variant="h5" as="h5">
            Verify & Publish Source Code
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="gray.400" />
      <ModalBody overflow="overlay">
        <Flex direction="column" gap={6}>
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
                <ExplorerLink type="code_id" value="1234" showCopyOnHover />
              </Flex>
              <Flex gap={2} alignItems="center">
                <Text fontWeight={500} color="text.dark" variant="body2">
                  Code Hash:
                </Text>
                <ExplorerLink
                  type="tx_hash"
                  value="8DA5A3...E4E5D899"
                  showCopyOnHover
                />
              </Flex>
            </Flex>
            <ControllerInput
              name="githubRepository"
              control={control}
              label="GitHub Repository URL:"
              labelBgColor="gray.800"
              variant="fixed-floating"
              placeholder="e.g. https://github.com/alleslabs/"
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
              placeholder="e.g. 8DA5A3...E4E5D899"
              helperText="Provide the commit hash"
              rules={{
                required: "",
              }}
              error={errors.commitHash?.message}
            />
            <Flex gap={4} alignItems="center">
              <ControllerInput
                name="wasmFileName"
                control={control}
                label="Wasm File Nme:"
                labelBgColor="gray.800"
                variant="fixed-floating"
                placeholder="e.g. celatone_contract"
                rules={{
                  required: "",
                }}
                error={errors.wasmFileName?.message}
              />
              <Text color="text.dark" variant="body1">
                .wasm
              </Text>
            </Flex>
            <SelectInput
              formLabel="Compiler Version"
              options={[
                {
                  label: "Rust 1.55.0",
                  value: "rust-1.55.0",
                  disabled: false,
                },
                {
                  label: "Rust 1.54.0",
                  value: "rust-1.54.0",
                  disabled: false,
                },
              ]}
              onChange={() => null}
              placeholder="Select or input the compiler version"
              initialSelected="rust-1.55.0"
              labelBgColor="gray.800"
              isRequired
            />
          </Flex>
          <Button onClick={handleSubmit(onSubmitVerifyPublishCode)}>
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
