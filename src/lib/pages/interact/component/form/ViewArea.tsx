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
import dynamic from "next/dynamic";
import { useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { AbiForm } from "lib/components/abi";
import { SubmitButton } from "lib/components/button";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useFunctionView } from "lib/services/move/module";
import type {
  AbiFormData,
  ExposedFunction,
  HexAddr,
  JsonDataType,
  Option,
} from "lib/types";
import { getAbiInitialData, jsonPrettify } from "lib/utils";

const MoveCodeSnippet = dynamic(
  () => import("lib/components/modal/MoveCodeSnippet"),
  {
    ssr: false,
  }
);

export const ViewArea = ({
  fn,
  moduleAddress,
  moduleName,
}: {
  fn: ExposedFunction;
  moduleAddress: HexAddr;
  moduleName: string;
}) => {
  const [abiData, setAbiData] = useState<AbiFormData>({
    args: getAbiInitialData(fn.params.length),
    typeArgs: getAbiInitialData(fn.generic_type_params.length),
  });
  const [abiErrors, setAbiErrors] = useState<[string, string][]>([
    ["form", "initial"],
  ]);
  const [res, setRes] = useState<JsonDataType>(undefined);
  const [error, setError] = useState<Option<string>>(undefined);

  const {
    isFetching: queryFetching,
    isRefetching: queryRefetching,
    refetch,
  } = useFunctionView({
    abiData,
    fn,
    moduleAddress,
    moduleName,
    onError: (err) => setError(err.response?.data.message || DEFAULT_RPC_ERROR),
    onSuccess: (data) => setRes(JSON.parse(data)),
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
    <Grid gap={6} w="full" templateColumns={{ base: "1fr", md: "1fr 1fr" }}>
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
            type="view"
            moduleAddress={moduleAddress}
            moduleName={moduleName}
          />
          <SubmitButton
            isDisabled={isButtonDisabled}
            text="View"
            isLoading={isLoading}
            onSubmit={() => {
              track(AmpEvent.ACTION_MOVE_VIEW);
              handleQuery();
            }}
          />
        </Flex>
      </GridItem>
      <GridItem>
        <Flex gap={4} direction="column">
          <Heading as="h6" variant="h6" color="text.main">
            Return
          </Heading>
          {error && (
            <Alert alignItems="center" gap={4} variant="error">
              <CustomIcon
                name="alert-triangle-solid"
                boxSize={4}
                color="error.main"
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
              gap={4}
              p="24px 8px"
              borderRadius="8px"
              direction="column"
            >
              {isLoading && <Spinner size="xl" />}
              <Text variant="body2" color="text.dark">
                {isLoading
                  ? "Viewing ..."
                  : "Result from viewing function will display here."}
              </Text>
            </Flex>
          ) : (
            <JsonReadOnly
              text={jsonPrettify(JSON.stringify(res))}
              amptrackSection="Module View Result"
              canCopy
            />
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};
