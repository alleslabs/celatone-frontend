import { Badge, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import { BackButton } from "lib/components/button/BackButton";
import { ExplorerLink } from "lib/components/ExplorerLink";
import PageContainer from "lib/components/PageContainer";
import { useCodeStore } from "lib/hooks";
import { useCodeData } from "lib/model/code";
import { InstantiatePermission } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { CodeInfoSection } from "./component/CodeInfoSection";
import { CTASection } from "./component/CTASection";

const CodeDetails = observer(() => {
  const router = useRouter();
  const codeIdParam = getFirstQueryParam(router.query.codeId);
  const codeId = Number(codeIdParam);
  /**
   * @todos Maybe use data from data hook instead
   */
  const { getCodeLocalInfo } = useCodeStore();
  const localCodeInfo = getCodeLocalInfo(codeId);
  const codeDetails = useCodeData(codeId);
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
            {localCodeInfo?.description ?? codeId}
          </Heading>
          <Flex gap={2}>
            <Text fontWeight={500} color="text.dark" variant="body2">
              Code ID
            </Text>
            <ExplorerLink type="code_id" value={codeIdParam} />
          </Flex>
        </Flex>
        {/* TODO: Check uploader with data hook */}
        <CTASection
          id={codeId}
          uploader={codeDetails?.uploader ?? localCodeInfo?.uploader ?? ""}
          description={localCodeInfo?.description}
          instantiatePermission={
            codeDetails?.instantiatePermission ?? InstantiatePermission.UNKNOWN
          }
          permissionAddresses={codeDetails?.permissionAddresses ?? []}
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
