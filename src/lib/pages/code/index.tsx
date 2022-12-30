import { Badge, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import { BackButton } from "lib/components/button/BackButton";
import { ExplorerLink } from "lib/components/ExplorerLink";
import PageContainer from "lib/components/PageContainer";
import { useCodeStore } from "lib/hooks";
import { getFirstQueryParam } from "lib/utils";

import { CodeInfoSection } from "./component/CodeInfoSection";
import { CTASection } from "./component/CTASection";

const CodeDetails = observer(() => {
  const router = useRouter();
  const codeId = getFirstQueryParam(router.query.codeId);
  /**
   * @todos Maybe use data from data hook instead
   */
  const { getCodeLocalInfo } = useCodeStore();
  const codeInfo = getCodeLocalInfo(Number(codeId));

  /**
   * @todos  Wireup page with data hook and component functionality/logic
   */
  return (
    <PageContainer>
      <BackButton />
      {/* Code ID and CTAs Section */}
      {/* TODO: Wireup CTAs logic and render ExplorerLink for Code ID */}
      <Flex align="center" justify="space-between" mt={6}>
        <Flex direction="column" gap={1}>
          <Heading as="h5" variant="h5">
            {codeInfo?.description ?? codeId}
          </Heading>
          <Flex gap={2}>
            <Text fontWeight={500} color="text.dark" variant="body2">
              Code ID
            </Text>
            <ExplorerLink value={codeId} />
          </Flex>
        </Flex>
        {/* TODO: Check uploader with data hook */}
        <CTASection
          id={Number(codeId)}
          uploader={codeInfo?.uploader ?? ""}
          description={codeInfo?.description ?? ""}
        />
      </Flex>
      <Divider borderColor="divider.main" my={12} />
      {/* Code Information Section */}
      {/* TODO: Use real data to render LabelText */}
      <CodeInfoSection />
      {/* TODO: Wireup badge count, Create table component and wireup with real data */}
      <Flex mb={6} align="center">
        <Heading as="h6" variant="h6">
          Contract Instances
        </Heading>
        <Badge ml={2} variant="primary">
          19
        </Badge>
      </Flex>
      <Heading color="error.main" as="h5" variant="h5">
        Table Goes Hereeee
      </Heading>
    </PageContainer>
  );
});

export default CodeDetails;
