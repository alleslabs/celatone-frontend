import { useRouter } from "next/router";
import { useEffect } from "react";

import { trackInvalidState } from "lib/amplitude";

import { EmptyState } from "./EmptyState";

interface InvalidStateProps {
  title: string;
}

export const InvalidState = ({ title }: InvalidStateProps) => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) trackInvalidState(title);
  }, [router.isReady, title]);

  return (
    <EmptyState
      heading={title}
      message="Please double-check your input and make sure you have selected the
    correct network."
      imageVariant="not-found"
      textVariant="body2"
      withBorder
    />
  );
};
