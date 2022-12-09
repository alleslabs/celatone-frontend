import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";

export default () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/upload")} rightIcon={<MdAdd />}>
      Upload New Code
    </Button>
  );
};
