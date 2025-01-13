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

enum Method {
  UPLOAD_FILE = "upload-file",
  LOAD_URL = "load-url",
  FILL_MANUALLY = "fill-manually",
}

type JsonState = Record<
  Method,
  { schemaString: string; error: Nullable<string> }
>;

enum ActionType {
  SET_SCHEMA = "set-schema",
  SET_ERROR = "set-error",
  RESET = "reset",
}

type Action = {
  type: ActionType;
  method: Method;
  schemaString?: string;
  error?: Nullable<string>;
};

const initialJsonState: JsonState = {
  [Method.UPLOAD_FILE]: { schemaString: "", error: null },
  [Method.LOAD_URL]: { schemaString: "", error: null },
  [Method.FILL_MANUALLY]: { schemaString: "", error: null },
};

const reducer = (state: JsonState, action: Action): JsonState => {
  switch (action.type) {
    case ActionType.SET_ERROR:
      return {
        ...state,
        [action.method]: {
          schemaString: state[action.method].schemaString,
          error: action.error,
        },
      };
    case ActionType.SET_SCHEMA:
      return {
        ...state,
        [action.method]: { schemaString: action.schemaString, error: null },
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
  method,
  state,
  urlLoading,
  dispatch,
}: {
  method: Method;
  state: JsonState;
  urlLoading: boolean;
  dispatch: Dispatch<Action>;
}) => {
  const [jsonFile, setJsonFile] = useState<File>();
  const { error, schemaString } = state[method];
  switch (method) {
    case Method.UPLOAD_FILE:
      return jsonFile ? (
        <UploadCard
          theme="gray"
          file={jsonFile}
          deleteFile={() => {
            setJsonFile(undefined);
            dispatch({
              type: ActionType.SET_SCHEMA,
              method,
              schemaString: "",
            });
          }}
          // TODO: change to discriminated union pattern later
          status={error ? "error" : undefined}
          statusText={error}
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
                type: ActionType.SET_SCHEMA,
                method,
                schemaString: content,
              });
            };
            try {
              reader.readAsText(file);
              setJsonFile(file);
            } catch {
              //
            }
          }}
        />
      );
    case Method.LOAD_URL: {
      let status: ResponseState = "init";
      if (urlLoading) status = "loading";
      else if (error) status = "error";
      return (
        <>
          <Heading as="h6" variant="h6" mb={4}>
            Fill in URL to load JSON Schema
          </Heading>
          <TextInput
            status={{
              state: status,
              message: error,
            }}
            value={schemaString}
            setInputState={(url: string) =>
              dispatch({
                type: ActionType.SET_SCHEMA,
                method,
                schemaString: url,
              })
            }
          />
        </>
      );
    }
    case Method.FILL_MANUALLY:
      return (
        <>
          <Heading as="h6" variant="h6" mb={4}>
            Contract Schema
          </Heading>
          <JsonInput
            text={schemaString}
            setText={(value: string) =>
              dispatch({
                type: ActionType.SET_SCHEMA,
                method,
                schemaString: value,
              })
            }
            validateFn={validateSchema}
            maxLines={12}
          />
        </>
      );
    default:
      return null;
  }
};

interface UploadTemplateInterface {
  codeHash: string;
  codeId: number;
  isReattach: boolean;
  closeDrawer: () => void;
  onSchemaSave?: () => void;
}

export const UploadTemplate = ({
  codeHash,
  codeId,
  isReattach,
  closeDrawer,
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
        type: ActionType.SET_ERROR,
        method,
        error: "Empty schema input",
      });

    // Retrieve schemaString from url
    if (method === Method.LOAD_URL) {
      try {
        setUrlLoading(true);
        const response = await fetch(schemaString);
        if (!response.ok) {
          setUrlLoading(false);
          return dispatchJsonState({
            type: ActionType.SET_ERROR,
            method,
            error:
              response.status === 404 ? "404 Not Found" : response.statusText,
          });
        }
        schemaString = JSON.stringify(await response.json());
      } catch (err) {
        setUrlLoading(false);
        return dispatchJsonState({
          type: ActionType.SET_ERROR,
          method,
          error: (err as Error).message,
        });
      }
    }
    const schemaValidateError = validateSchema(schemaString);

    if (schemaValidateError) {
      setUrlLoading(false);
      return dispatchJsonState({
        type: ActionType.SET_ERROR,
        method,
        error: schemaValidateError,
      });
    }
    saveNewSchema(codeHash, codeId.toString(), JSON.parse(schemaString));
    track(AmpEvent.ACTION_ATTACH_JSON, { method, isReattach });
    toast({
      title: `Attached JSON Schema`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });

    setUrlLoading(false);
    onSchemaSave?.();
    closeDrawer();
    return dispatchJsonState({ type: ActionType.RESET, method });
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
      case Method.UPLOAD_FILE:
        return !methodSchemaString;
      case Method.LOAD_URL:
        return !methodSchemaString || urlLoading;
      case Method.FILL_MANUALLY:
        return Boolean(validateSchema(methodSchemaString));
      default:
        return false;
    }
  }, [method, jsonState, urlLoading]);

  return (
    <Flex
      direction="column"
      px={6}
      mt={6}
      pt={6}
      borderTop="1px solid"
      borderColor="gray.700"
    >
      <RadioGroup
        onChange={(nextVal) => setMethod(nextVal as Method)}
        value={method}
        mb={6}
      >
        <Flex gap="64px">
          <Radio value={Method.UPLOAD_FILE}>Upload File</Radio>
          <Radio value={Method.LOAD_URL}>Load from URL</Radio>
          <Radio value={Method.FILL_MANUALLY}>Fill Manually</Radio>
        </Flex>
      </RadioGroup>
      <MethodRender
        method={method}
        state={jsonState}
        urlLoading={urlLoading}
        dispatch={dispatchJsonState}
      />
      <Button
        w="400px"
        alignSelf="center"
        mt={6}
        onClick={handleSave}
        isDisabled={disabledState}
      >
        Save JSON Schema
      </Button>
      <Text variant="body2" color="text.dark" alignSelf="center" my={3}>
        Your JSON schema will be{" "}
        <span style={{ fontWeight: 600 }}>stored locally on your device</span>
      </Text>
    </Flex>
  );
};
