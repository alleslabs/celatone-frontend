import { useToast as useChakraToast } from "@chakra-ui/react";
import type { AlertStatus } from "@chakra-ui/react";
// TODO: p'peach will look into this issue

// import type { ReactNode } from "react";
// import { CustomIcon } from "../icon/CustomIcon";

// const getStatusIcon = (status: AlertStatus) => {
//   switch (status) {
//     case "success":
//       return  ( <CustomIcon name="checkCircle" color="success.main"/>)
//     case "error":
//       return ( <CustomIcon name="close" color="error.light"/>
// )
//   }
// }
export function useToast() {
  const toast = useChakraToast();

  return (title: string, status: AlertStatus, isClosable: boolean) => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable,
      position: "bottom-right",
    });
  };
}
