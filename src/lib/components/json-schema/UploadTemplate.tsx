import {
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import type { Dispatch } from "react";
import { useMemo, useCallback, useReducer, useState } from "react";

import { DropZone } from "lib/components/dropzone";
import type { ResponseState } from "lib/components/forms";
import { TextInput } from "lib/components/forms";
import JsonInput from "lib/components/json/JsonInput";
import { UploadCard } from "lib/components/upload/UploadCard";
import { useSchemaStore } from "lib/providers/store";
import { jsonValidate } from "lib/utils";

enum Method {
  UPLOAD_FILE = "upload-file",
  LOAD_URL = "load-url",
  FILL_MANUALLY = "fill-manually",
}

type JsonState = Record<Method, { schemaString: string; error: string | null }>;

enum ActionType {
  SET_SCHEMA = "set-schema",
  SET_ERROR = "set-error",
  RESET = "reset",
}

type Action = {
  type: ActionType;
  method: Method;
  schemaString?: string;
  error?: string | null;
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

const validateSchema = (schemaString: string): string | null => {
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
          theme="secondary"
          file={jsonFile}
          deleteFile={() => {
            setJsonFile(undefined);
            dispatch({
              type: ActionType.SET_SCHEMA,
              method,
              schemaString: "",
            });
          }}
          error={error}
        />
      ) : (
        <DropZone
          fileType="schema"
          setFile={async (file: File) => {
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
            } catch (err) {
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
            maxLines={25}
          />
        </>
      );
    default:
      return null;
  }
};

interface UploadTemplateInterface {
  codeHash: string;
  codeId: string;
  closeDrawer: () => void;
  onSchemaSave?: () => void;
}

export const UploadTemplate = ({
  codeHash,
  codeId,
  closeDrawer,
  onSchemaSave,
}: UploadTemplateInterface) => {
  const { saveNewSchema } = useSchemaStore();
  const [method, setMethod] = useState<Method>(Method.UPLOAD_FILE);
  const [jsonState, dispatchJsonState] = useReducer(reducer, initialJsonState);
  const [urlLoading, setUrlLoading] = useState(false);

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
    saveNewSchema(codeHash, codeId, JSON.parse(schemaString));
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
    onSchemaSave,
    saveNewSchema,
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
    <Flex direction="column">
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
        disabled={disabledState}
      >
        Save JSON Schema
      </Button>
      <Flex justifyContent="center" w="full" my={3}>
        <Text variant="body2" color="text.dark">
          Your JSON schema will be
        </Text>
        <Text variant="body2" color="text.dark" fontWeight={600}>
          stored locally on your device
        </Text>
      </Flex>
    </Flex>
  );
};
