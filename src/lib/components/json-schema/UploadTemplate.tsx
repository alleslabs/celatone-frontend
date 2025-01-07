import {
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Text,
  useToast,
} from "@chakra-ui/react";
import type { Dispatch } from "react";
import { useCallback, useMemo, useReducer, useState } from "react";

import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";
import { DropZone } from "lib/components/dropzone";
import type { ResponseState } from "lib/components/forms";
import { TextInput } from "lib/components/forms";
import JsonInput from "lib/components/json/JsonInput";
import { UploadCard } from "lib/components/upload/UploadCard";
import { useSchemaStore } from "lib/providers/store";
import type { Nullable } from "lib/types";
import { jsonValidate } from "lib/utils";

enum ActionType {
  RESET = "reset",
  SET_ERROR = "set-error",
  SET_SCHEMA = "set-schema",
}

enum Method {
  FILL_MANUALLY = "fill-manually",
  LOAD_URL = "load-url",
  UPLOAD_FILE = "upload-file",
}

type Action = {
  error?: Nullable<string>;
  method: Method;
  schemaString?: string;
  type: ActionType;
};

type JsonState = Record<
  Method,
  { error: Nullable<string>; schemaString: string }
>;

const initialJsonState: JsonState = {
  [Method.FILL_MANUALLY]: { error: null, schemaString: "" },
  [Method.LOAD_URL]: { error: null, schemaString: "" },
  [Method.UPLOAD_FILE]: { error: null, schemaString: "" },
};

const reducer = (state: JsonState, action: Action): JsonState => {
  switch (action.type) {
    case ActionType.SET_ERROR:
      return {
        ...state,
        [action.method]: {
          error: action.error,
          schemaString: state[action.method].schemaString,
        },
      };
    case ActionType.SET_SCHEMA:
      return {
        ...state,
        [action.method]: { error: null, schemaString: action.schemaString },
      };
    case ActionType.RESET:
    default:
      return initialJsonState;
  }
};

const validateSchema = (schemaString: string): Nullable<string> => {
  return (
    jsonValidate(schemaString) ??
    ("instantiate" in JSON.parse(schemaString)
      ? null
      : "`instantiate` field is missing in JSON Schema")
  );
};

const MethodRender = ({
  dispatch,
  method,
  state,
  urlLoading,
}: {
  dispatch: Dispatch<Action>;
  method: Method;
  state: JsonState;
  urlLoading: boolean;
}) => {
  const [jsonFile, setJsonFile] = useState<File>();
  const { error, schemaString } = state[method];
  switch (method) {
    case Method.FILL_MANUALLY:
      return (
        <>
          <Heading as="h6" mb={4} variant="h6">
            Contract Schema
          </Heading>
          <JsonInput
            validateFn={validateSchema}
            maxLines={12}
            setText={(value: string) =>
              dispatch({
                method,
                schemaString: value,
                type: ActionType.SET_SCHEMA,
              })
            }
            text={schemaString}
          />
        </>
      );
    case Method.LOAD_URL: {
      let status: ResponseState = "init";
      if (urlLoading) status = "loading";
      else if (error) status = "error";
      return (
        <>
          <Heading as="h6" mb={4} variant="h6">
            Fill in URL to load JSON Schema
          </Heading>
          <TextInput
            setInputState={(url: string) =>
              dispatch({
                method,
                schemaString: url,
                type: ActionType.SET_SCHEMA,
              })
            }
            status={{
              message: error,
              state: status,
            }}
            value={schemaString}
          />
        </>
      );
    }
    case Method.UPLOAD_FILE:
      return jsonFile ? (
        <UploadCard
          deleteFile={() => {
            setJsonFile(undefined);
            dispatch({
              method,
              schemaString: "",
              type: ActionType.SET_SCHEMA,
            });
          }}
          file={jsonFile}
          // TODO: change to discriminated union pattern later
          status={error ? "error" : undefined}
          statusText={error}
          theme="gray"
        />
      ) : (
        <DropZone
          fileType={["schema"]}
          setFiles={async (files: File[]) => {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
              const content = reader.result as string;
              dispatch({
                method,
                schemaString: content,
                type: ActionType.SET_SCHEMA,
              });
            };
            try {
              reader.readAsText(file);
              setJsonFile(file);
            } catch (err) {
              //
            }
          }}
        />
      );
    default:
      return null;
  }
};

interface UploadTemplateInterface {
  closeDrawer: () => void;
  codeHash: string;
  codeId: number;
  isReattach: boolean;
  onSchemaSave?: () => void;
}

export const UploadTemplate = ({
  closeDrawer,
  codeHash,
  codeId,
  isReattach,
  onSchemaSave,
}: UploadTemplateInterface) => {
  const { saveNewSchema } = useSchemaStore();
  const [method, setMethod] = useState<Method>(Method.UPLOAD_FILE);
  const [jsonState, dispatchJsonState] = useReducer(reducer, initialJsonState);
  const [urlLoading, setUrlLoading] = useState(false);
  const toast = useToast();

  const handleSave = useCallback(async () => {
    let { schemaString } = jsonState[method];
    if (!schemaString)
      return dispatchJsonState({
        error: "Empty schema input",
        method,
        type: ActionType.SET_ERROR,
      });

    // Retrieve schemaString from url
    if (method === Method.LOAD_URL) {
      try {
        setUrlLoading(true);
        const response = await fetch(schemaString);
        if (!response.ok) {
          setUrlLoading(false);
          return dispatchJsonState({
            error:
              response.status === 404 ? "404 Not Found" : response.statusText,
            method,
            type: ActionType.SET_ERROR,
          });
        }
        schemaString = JSON.stringify(await response.json());
      } catch (err) {
        setUrlLoading(false);
        return dispatchJsonState({
          error: (err as Error).message,
          method,
          type: ActionType.SET_ERROR,
        });
      }
    }
    const schemaValidateError = validateSchema(schemaString);

    if (schemaValidateError) {
      setUrlLoading(false);
      return dispatchJsonState({
        error: schemaValidateError,
        method,
        type: ActionType.SET_ERROR,
      });
    }
    saveNewSchema(codeHash, codeId.toString(), JSON.parse(schemaString));
    track(AmpEvent.ACTION_ATTACH_JSON, { isReattach, method });
    toast({
      duration: 5000,
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title: `Attached JSON Schema`,
    });

    setUrlLoading(false);
    onSchemaSave?.();
    closeDrawer();
    return dispatchJsonState({ method, type: ActionType.RESET });
  }, [
    closeDrawer,
    codeHash,
    codeId,
    jsonState,
    method,
    isReattach,
    onSchemaSave,
    saveNewSchema,
    toast,
  ]);

  const disabledState = useMemo(() => {
    const methodSchemaString = jsonState[method].schemaString;
    switch (method) {
      case Method.FILL_MANUALLY:
        return Boolean(validateSchema(methodSchemaString));
      case Method.LOAD_URL:
        return !methodSchemaString || urlLoading;
      case Method.UPLOAD_FILE:
        return !methodSchemaString;
      default:
        return false;
    }
  }, [method, jsonState, urlLoading]);

  return (
    <Flex
      mt={6}
      pt={6}
      px={6}
      borderColor="gray.700"
      borderTop="1px solid"
      direction="column"
    >
      <RadioGroup
        mb={6}
        value={method}
        onChange={(nextVal) => setMethod(nextVal as Method)}
      >
        <Flex gap="64px">
          <Radio value={Method.UPLOAD_FILE}>Upload File</Radio>
          <Radio value={Method.LOAD_URL}>Load from URL</Radio>
          <Radio value={Method.FILL_MANUALLY}>Fill Manually</Radio>
        </Flex>
      </RadioGroup>
      <MethodRender
        dispatch={dispatchJsonState}
        state={jsonState}
        method={method}
        urlLoading={urlLoading}
      />
      <Button
        alignSelf="center"
        isDisabled={disabledState}
        mt={6}
        w="400px"
        onClick={handleSave}
      >
        Save JSON Schema
      </Button>
      <Text alignSelf="center" my={3} variant="body2" color="text.dark">
        Your JSON schema will be{" "}
        <span style={{ fontWeight: 600 }}>stored locally on your device</span>
      </Text>
    </Flex>
  );
};
