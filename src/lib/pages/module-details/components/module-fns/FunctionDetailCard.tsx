import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  chakra,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";

import { AmpEvent, track, trackUseExpand } from "lib/amplitude";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { DotSeparator } from "lib/components/DotSeparator";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { Tooltip } from "lib/components/Tooltip";
import type { FunctionTypeTabIndex } from "lib/pages/module-details/types";
import type { ExposedFunction, IndexedModule, Visibility } from "lib/types";
import { checkAvailability, getVisibilityIcon } from "lib/utils";

interface FunctionDetailCardProps {
  fnType: FunctionTypeTabIndex;
  exposedFn: ExposedFunction;
  address: IndexedModule["address"];
  moduleName: IndexedModule["moduleName"];
}

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    color: "gray.600",
  },
});

const VisibilityLabel = ({ visibility }: { visibility: Visibility }) => (
  <Flex alignItems="center">
    <CustomIcon
      name={getVisibilityIcon(visibility)}
      color="gray.600"
      boxSize={3}
    />
    <Text variant="body3" color="text.dark" textTransform="capitalize">
      {visibility}
    </Text>
  </Flex>
);

const FunctionButton = ({
  fnType,
  isView,
  disabled,
  address,
  moduleName,
  exposedFn,
}: {
  fnType: FunctionTypeTabIndex;
  isView: boolean;
  disabled: boolean;
  address: string;
  moduleName: string;
  exposedFn: ExposedFunction;
}) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const getButtonStyle = () => {
    if ((isMobile && !isView) || disabled)
      return { variant: "outline-gray", color: "gray.500" };
    if (isView) return { variant: "outline-primary", color: "primary.dark" };
    return { variant: "outline-secondary", color: "secondary.main" };
  };

  return (
    <Tooltip
      bg="primary.dark"
      label={
        isMobile && !isView
          ? "You can currently execute functions on a desktop device only"
          : "Only execute functions with “is_entry: true” and “visibility: public” are interactable through Celatone’s module interactions."
      }
      hidden={!disabled && !(isMobile && !isView)}
    >
      <Button
        variant={getButtonStyle().variant}
        isDisabled={disabled || (isMobile && !isView)}
        borderColor={getButtonStyle().color}
        size="sm"
        minW={{ md: 24 }}
        onClick={(e) => {
          track(AmpEvent.USE_MODULE_FUNCTION_CTA, {
            address,
            moduleName,
            functionType: isView ? "view" : "execute",
            functionName: exposedFn.name,
            section: fnType,
          });
          navigate({
            pathname: "/interact",
            query: {
              address,
              moduleName,
              functionType: isView ? "view" : "execute",
              functionName: exposedFn.name,
            },
          });
          e.stopPropagation();
        }}
        leftIcon={
          <CustomIcon
            mx={0}
            name={isView ? "query" : "execute"}
            color={getButtonStyle().color}
            boxSize={3}
          />
        }
      >
        <Text color={getButtonStyle().color} mt="2px">
          {isView ? "View" : "Execute"}
        </Text>
      </Button>
    </Tooltip>
  );
};

const FunctionDetail = ({ exposedFn }: { exposedFn: ExposedFunction }) => (
  <AccordionPanel bg="gray.900" borderRadius={8} mt={4} py={3} px={4}>
    <Flex gap={3} direction="column">
      <Flex gap={8}>
        <LabelText
          isSmall
          label="visibility"
          labelWeight={700}
          labelColor="text.disabled"
        >
          <Flex align="center">
            <CustomIcon
              name={getVisibilityIcon(exposedFn.visibility)}
              boxSize={3}
              ml={0}
              color="gray.600"
            />
            <Text variant="body3" textTransform="capitalize">
              {exposedFn.visibility}
            </Text>
          </Flex>
        </LabelText>
        <LabelText
          isSmall
          label="is_entry"
          labelWeight={700}
          labelColor="text.disabled"
        >
          <Flex align="center">
            <CustomIcon
              boxSize={3}
              ml={0}
              color={exposedFn.is_entry ? "success.main" : "gray.600"}
              name={exposedFn.is_entry ? "check" : "close"}
            />
            <Text variant="body3">{String(exposedFn.is_entry)}</Text>
          </Flex>
        </LabelText>
        <LabelText
          isSmall
          label="is_view"
          labelWeight={700}
          labelColor="text.disabled"
        >
          <Flex align="center">
            <CustomIcon
              boxSize={3}
              ml={0}
              color={exposedFn.is_view ? "success.main" : "gray.600"}
              name={exposedFn.is_view ? "check" : "close"}
            />
            <Text variant="body3">{String(exposedFn.is_view)}</Text>
          </Flex>
        </LabelText>
      </Flex>
      <LabelText
        isSmall
        label="generic_type_params"
        labelWeight={700}
        labelColor="text.disabled"
      >
        <Text variant="body3">
          {JSON.stringify(exposedFn.generic_type_params)}
        </Text>
      </LabelText>
      <LabelText
        isSmall
        label="params"
        labelWeight={700}
        labelColor="text.disabled"
      >
        <Text variant="body3">{JSON.stringify(exposedFn.params)}</Text>
      </LabelText>
    </Flex>
  </AccordionPanel>
);

export const FunctionDetailCard = ({
  fnType,
  exposedFn,
  address,
  moduleName,
}: FunctionDetailCardProps) => {
  const { is_view: isView, visibility, name } = exposedFn;
  const disabled = !checkAvailability(exposedFn);
  const isMobile = useMobile();
  const fnColor = isView ? "primary.main" : "secondary.main";

  return (
    <AccordionItem
      bg="gray.800"
      _hover={{ bg: "gray.700" }}
      borderRadius={8}
      p={{ base: 3, md: 4 }}
      transition="all .25s ease-in-out"
      flexDirection="column"
      gap={1}
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            flexDirection="column"
            alignItems="flex-start"
            _hover={{ bg: "transparent" }}
            onClick={() =>
              trackUseExpand({
                action: !isExpanded ? "expand" : "collapse",
                component: "module_function_accordion",
                info: { functionType: isView ? "view" : "execute" },
                section: fnType,
              })
            }
          >
            <Flex justifyContent="space-between" w="full" gap={2}>
              <Flex direction="column" gap={1} alignItems="flex-start">
                <Flex alignItems="center" gap={1}>
                  <Flex gap={{ base: 0, md: 1 }} alignItems="center">
                    <CustomIcon
                      name={isView ? "query" : "execute"}
                      color={fnColor}
                      boxSize={3}
                    />
                    <Text variant="body3" color={fnColor}>
                      {isView ? "View" : "Execute"}
                    </Text>
                  </Flex>
                  <DotSeparator
                    bg="gray.600"
                    ml={1}
                    display={{ base: "flex", md: "none" }}
                  />
                  {isMobile && <VisibilityLabel visibility={visibility} />}
                </Flex>
                <Text
                  variant="body2"
                  color="text.main"
                  wordBreak="break-word"
                  textAlign="left"
                >
                  {name}
                </Text>
              </Flex>
              <Flex alignItems="center" gap={{ base: 0, md: 4 }}>
                {!isMobile && <VisibilityLabel visibility={visibility} />}
                <FunctionButton
                  fnType={fnType}
                  isView={isView}
                  disabled={disabled}
                  address={address}
                  moduleName={moduleName}
                  exposedFn={exposedFn}
                />
                <StyledIconButton
                  variant="none"
                  aria-label="external"
                  _hover={{ backgroundColor: "gray.700" }}
                  icon={
                    <CustomIcon
                      name="chevron-down"
                      transform={isExpanded ? "rotate(180deg)" : "rotate(0)"}
                      transition="all .25s ease-in-out"
                    />
                  }
                />
              </Flex>
            </Flex>
          </AccordionButton>
          <FunctionDetail exposedFn={exposedFn} />
        </>
      )}
    </AccordionItem>
  );
};
