import { useToast as useChakraToast } from "@chakra-ui/react";
import type { AlertStatus } from "@chakra-ui/react";
// TODO: p'peach will look into this issue

// import type { ReactNode } from "react";
// import {  MdCheckCircle,MdCancel } from "react-icons/md";

// const iconProps = {
//   boxSize: "6",
//   display: "flex",
//   alignItems: "center",
// };

// const getStatusIcon = (status: AlertStatus) => {
//   switch (status) {
//     case "success":
//       return  ( <Icon as={MdCheckCircle}
//       color="success.main"
//       style={iconProps}
//     />)
//     case "error":
//       return ( <Icon as={MdCancel}
//       color="error.light"
//       style={iconProps}
//     />
// )
//   }
// }
export function useToast() {
  const toast = useChakraToast();

  return (
    title: string,
    status: AlertStatus,
    isClosable: boolean
    // icon: ReactNode
  ) => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable,
      position: "bottom-right",
      // icon,
    });
  };
}
