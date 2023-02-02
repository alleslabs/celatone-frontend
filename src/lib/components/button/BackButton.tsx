import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost-primary"
      size="sm"
      mb="8px"
      onClick={() => router.back()}
      leftIcon={<ArrowBackIcon boxSize={4} />}
    >
      BACK
    </Button>
  );
};
