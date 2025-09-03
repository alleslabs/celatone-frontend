import type { AxiosError } from "axios";
import type {
  AbiFormData,
  ExposedFunction,
  HexAddr,
  JsonDataType,
  Option,
  RpcQueryError,
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
import { useQueryEvents } from "lib/hooks";
import { useFunctionView } from "lib/services/move/module";
import { getAbiInitialData, jsonPrettify } from "lib/utils";
import dynamic from "next/dynamic";
import { useState } from "react";

const MoveCodeSnippet = dynamic(
  () => import("lib/components/modal/move-code-snippet"),
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

  const functionViewQuery = useFunctionView({
    abiData,
    fn,
    moduleAddress,
    moduleName,
  });
  useQueryEvents(functionViewQuery, {
    onError: (err) =>
      setError(
        (err as AxiosError<RpcQueryError>).response?.data.message ||
          DEFAULT_RPC_ERROR
      ),
    onSuccess: (data) => setRes(JSON.parse(data)),
  });
  const {
    isFetching: queryFetching,
    isRefetching: queryRefetching,
    refetch,
  } = functionViewQuery;

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
            />
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};
