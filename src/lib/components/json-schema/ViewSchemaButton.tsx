import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

import type { CodeSchema } from "lib/stores/schema";
import type { Option } from "lib/types";

interface ViewSchemaButtonProps extends ButtonProps {
  codeId: string;
  schema: Option<CodeSchema>;
}

export const ViewSchemaButton = ({
  codeId,
  schema,
  ...buttonProps
}: ViewSchemaButtonProps) => (
  <Button
    variant="outline-gray"
    size="sm"
    onClick={() => {
      const jsonString = JSON.stringify(schema, null, 2);
      const jsonWindow = window.open();
      if (jsonWindow) {
        // Modify styling later
        jsonWindow.document.write(
          `<html><head><title>JSON Schema | Code ID ${codeId}</title>`
        );

        // Add styling
        jsonWindow.document.write(
          "<style>body { background-color: #f0f0f0; color: #333; }</style>"
        );

        jsonWindow.document.write(
          `</head><body><pre>${jsonString}</pre></body></html>`
        );
      }
    }}
    {...buttonProps}
  >
    View JSON
  </Button>
);
