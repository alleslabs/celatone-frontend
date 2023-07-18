import { useMediaQuery } from "react-responsive";

export const useMobile = () => useMediaQuery({ query: "(max-width: 767px)" });
