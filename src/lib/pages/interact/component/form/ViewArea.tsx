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
import { useFunctionView } from "lib/services/move";
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
    <Grid templateColumns="1fr 1fr" gap={6}>
      <GridItem>
        <AbiForm
          fn={fn}
          initialData={abiData}
          propsOnChange={setAbiData}
          propsOnErrors={setAbiErrors}
        />
        <Flex align="center" justify="space-between" mt={4}>
          <MoveCodeSnippet
            moduleAddress={moduleAddress}
            moduleName={moduleName}
            fn={fn}
            abiData={abiData}
            type="view"
          />
          <SubmitButton
            text="View"
            isLoading={isLoading}
            onSubmit={() => {
              track(AmpEvent.ACTION_MOVE_VIEW);
              handleQuery();
            }}
            isDisabled={isButtonDisabled}
          />
        </Flex>
      </GridItem>
      <GridItem>
        <Flex direction="column" gap={4}>
          <Heading variant="h6" as="h6" color="text.main">
            Return
          </Heading>
          {error && (
            <Alert variant="error" alignItems="center" gap={4}>
              <CustomIcon
                name="alert-circle-solid"
                color="error.main"
                boxSize={4}
              />
              <AlertDescription wordBreak="break-word">
                {error}
              </AlertDescription>
            </Alert>
          )}
          {res === undefined ? (
            <Flex
              direction="column"
              alignItems="center"
              gap={4}
              p="24px 8px"
              borderRadius="8px"
              bg="gray.900"
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
              amptrackSection="Module View Result"
              text={jsonPrettify(JSON.stringify(res))}
              canCopy
            />
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};
