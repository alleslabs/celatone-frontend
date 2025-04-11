import { Button, Text } from "@chakra-ui/react";
import { useInternalNavigate, useMobile } from "lib/app-provider";

import { AppLink } from "../AppLink";

export const NotVerifiedDetails = () => {
  const navigate = useInternalNavigate();
  const isMobile = useMobile();

  return isMobile ? (
    <Text color="text.dark" variant="body2" whiteSpace="pre-line">
      {`This module has not been verified. If you are the owner, you can submit for verification with the new files.\n\nVerification is only currently supported on desktop.`}
    </Text>
  ) : (
    <>
      <Text color="text.dark" variant="body2">
        This module has not been verified. If you are the owner, you can{" "}
        <AppLink href="/modules/verify">
          <Text
            _hover={{
              textDecoration: "underline",
              textDecorationColor: "primary.light",
              "& > p": { color: "primary.light" },
            }}
            color="primary.main"
            display="inline-flex"
            gap={1}
            size="sm"
            transition="all .25s ease-in-out"
          >
            submit for verification
          </Text>
        </AppLink>{" "}
        with the new files.
      </Text>
      <Button
        size="sm"
        variant="ghost-primary"
        onClick={() => {
          navigate({
            pathname: "/modules/verify",
          });
        }}
      >
        Submit verification
      </Button>
    </>
  );
};
