import type {
  AbiFormData,
  ExposedFunction,
  HexAddr,
  JsonDataType,
  Option,
} from "lib/types";

import {
  Alert,
  AlertDescription,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { SubmitButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { AbiForm } from "lib/components/move-abi";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useFunctionView } from "lib/services/move/module";
import { getAbiInitialData, jsonPrettify } from "lib/utils";
import dynamic from "next/dynamic";
import { useState } from "react";

const MoveCodeSnippet = dynamic(
  () => import("lib/components/modal/MoveCodeSnippet"),
  {
    ssr: false,
  }
);

export const ViewArea = ({
  moduleAddress,
  moduleName,
  fn,
}: {
  moduleAddress: HexAddr;
  moduleName: string;
  fn: ExposedFunction;
}) => {
  const [abiData, setAbiData] = useState<AbiFormData>({
    typeArgs: getAbiInitialData(fn.generic_type_params.length),
    args: getAbiInitialData(fn.params.length),
  });
  const [abiErrors, setAbiErrors] = useState<[string, string][]>([
    ["form", "initial"],
  ]);
  const [res, setRes] = useState<JsonDataType>(undefined);
  const [error, setError] = useState<Option<string>>(undefined);

  const {
    refetch,
    isFetching: queryFetching,
    isRefetching: queryRefetching,
  } = useFunctionView({
    moduleAddress,
    moduleName,
    fn,
    abiData,
    onSuccess: (data) => setRes(JSON.parse(data)),
    onError: (err) => setError(err.response?.data.message || DEFAULT_RPC_ERROR),
  });

  const handleQuery = () => {
    refetch();
    setError(undefined);
  };

  const isLoading = queryFetching || queryRefetching;
  const isButtonDisabled = Boolean(
    Object.values(abiData.typeArgs).some((v) => !v.length) || !!abiErrors.length
  );
  return (
    <Grid gap={6} templateColumns={{ base: "1fr", md: "1fr 1fr" }} w="full">
      <GridItem>
        <AbiForm
          fn={fn}
          initialData={abiData}
          propsOnChange={setAbiData}
          propsOnErrors={setAbiErrors}
        />
        <Flex align="center" justify="space-between" mt={4}>
          <MoveCodeSnippet
            abiData={abiData}
            fn={fn}
            moduleAddress={moduleAddress}
            moduleName={moduleName}
            type="view"
          />
          <SubmitButton
            isDisabled={isButtonDisabled}
            isLoading={isLoading}
            text="View"
            onSubmit={() => {
              track(AmpEvent.ACTION_MOVE_VIEW);
              handleQuery();
            }}
          />
        </Flex>
      </GridItem>
      <GridItem>
        <Flex direction="column" gap={4}>
          <Heading as="h6" color="text.main" variant="h6">
            Return
          </Heading>
          {error && (
            <Alert alignItems="center" gap={4} variant="error">
              <CustomIcon
                boxSize={4}
                color="error.main"
                name="alert-triangle-solid"
              />
              <AlertDescription wordBreak="break-word">
                {error}
              </AlertDescription>
            </Alert>
          )}
          {res === undefined ? (
            <Flex
              alignItems="center"
              bg="gray.900"
              borderRadius="8px"
              direction="column"
              gap={4}
              p="24px 8px"
            >
              {isLoading && <Spinner size="xl" />}
              <Text color="text.dark" variant="body2">
                {isLoading
                  ? "Viewing ..."
                  : "Result from viewing function will display here."}
              </Text>
            </Flex>
          ) : (
            <JsonReadOnly
              amptrackSection="Module view result"
              canCopy
              text={jsonPrettify(JSON.stringify(res))}
              text={jsonPrettify(JSON.stringify(res))}
            />
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};
