import { Button } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";

export default () => {
  const navigate = useInternalNavigate();
  return (
    <Button
      onClick={() => navigate({ pathname: "/upload" })}
      rightIcon={<MdAdd />}
    >
      Upload New Code
    </Button>
  );
};
