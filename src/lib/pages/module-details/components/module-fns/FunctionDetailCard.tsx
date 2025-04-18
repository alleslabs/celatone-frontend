import type { FunctionTypeTabIndex } from "lib/pages/module-details/types";
import type { ExposedFunction, IndexedModule, Visibility } from "lib/types";

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
import { checkAvailability, getVisibilityIcon } from "lib/utils";

interface FunctionDetailCardProps {
  fnType: FunctionTypeTabIndex;
  exposedFn: ExposedFunction;
  address: IndexedModule["address"];
  moduleName: IndexedModule["moduleName"];
}

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    color: "gray.600",
    display: "flex",
    fontSize: "24px",
  },
});

const VisibilityLabel = ({ visibility }: { visibility: Visibility }) => (
  <Flex alignItems="center">
    <CustomIcon
      boxSize={3}
      color="gray.600"
      name={getVisibilityIcon(visibility)}
    />
    <Text color="text.dark" textTransform="capitalize" variant="body3">
      {visibility}
    </Text>
  </Flex>
);

const FunctionButton = ({
  address,
  disabled,
  exposedFn,
  fnType,
  isView,
  moduleName,
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
      return { color: "gray.500", variant: "outline-gray" };
    if (isView) return { color: "primary.dark", variant: "outline-primary" };
    return { color: "secondary.main", variant: "outline-secondary" };
  };

  return (
    <Tooltip
      hidden={!disabled && !(isMobile && !isView)}
      label={
        isMobile && !isView
          ? "You can currently execute functions on a desktop device only"
          : "Only execute functions with “is_entry: true” and “visibility: public” are interactable through Scan’s module interactions."
      }
    >
      <Button
        borderColor={getButtonStyle().color}
        isDisabled={disabled || (isMobile && !isView)}
        leftIcon={
          <CustomIcon
            boxSize={3}
            color={getButtonStyle().color}
            mx={0}
            name={isView ? "query" : "execute"}
          />
        }
        minW={{ md: 24 }}
        size="sm"
        variant={getButtonStyle().variant}
        onClick={(e) => {
          track(AmpEvent.USE_MODULE_FUNCTION_CTA, {
            address,
            functionName: exposedFn.name,
            functionType: isView ? "view" : "execute",
            moduleName,
            section: fnType,
          });
          navigate({
            pathname: "/interact",
            query: {
              address,
              functionName: exposedFn.name,
              functionType: isView ? "view" : "execute",
              moduleName,
            },
          });
          e.stopPropagation();
        }}
      >
        <Text color={getButtonStyle().color} mt="2px">
          {isView ? "View" : "Execute"}
        </Text>
      </Button>
    </Tooltip>
  );
};

const FunctionDetail = ({ exposedFn }: { exposedFn: ExposedFunction }) => (
  <AccordionPanel bg="gray.900" borderRadius={8} mt={4} px={4} py={3}>
    <Flex direction="column" gap={3}>
      <Flex gap={8}>
        <LabelText
          isSmall
          label="visibility"
          labelColor="text.disabled"
          labelWeight={700}
        >
          <Flex align="center">
            <CustomIcon
              boxSize={3}
              color="gray.600"
              ml={0}
              name={getVisibilityIcon(exposedFn.visibility)}
            />
            <Text textTransform="capitalize" variant="body3">
              {exposedFn.visibility}
            </Text>
          </Flex>
        </LabelText>
        <LabelText
          isSmall
          label="is_entry"
          labelColor="text.disabled"
          labelWeight={700}
        >
          <Flex align="center">
            <CustomIcon
              boxSize={3}
              color={exposedFn.is_entry ? "success.main" : "gray.600"}
              ml={0}
              name={exposedFn.is_entry ? "check" : "close"}
            />
            <Text variant="body3">{String(exposedFn.is_entry)}</Text>
          </Flex>
        </LabelText>
        <LabelText
          isSmall
          label="is_view"
          labelColor="text.disabled"
          labelWeight={700}
        >
          <Flex align="center">
            <CustomIcon
              boxSize={3}
              color={exposedFn.is_view ? "success.main" : "gray.600"}
              ml={0}
              name={exposedFn.is_view ? "check" : "close"}
            />
            <Text variant="body3">{String(exposedFn.is_view)}</Text>
          </Flex>
        </LabelText>
      </Flex>
      <LabelText
        isSmall
        label="generic_type_params"
        labelColor="text.disabled"
        labelWeight={700}
      >
        <Text variant="body3">
          {JSON.stringify(exposedFn.generic_type_params)}
        </Text>
      </LabelText>
      <LabelText
        isSmall
        label="params"
        labelColor="text.disabled"
        labelWeight={700}
      >
        <Text variant="body3">{JSON.stringify(exposedFn.params)}</Text>
      </LabelText>
    </Flex>
  </AccordionPanel>
);

export const FunctionDetailCard = ({
  address,
  exposedFn,
  fnType,
  moduleName,
}: FunctionDetailCardProps) => {
  const { is_view: isView, name, visibility } = exposedFn;
  const disabled = !checkAvailability(exposedFn);
  const isMobile = useMobile();
  const fnColor = isView ? "primary.main" : "secondary.main";

  return (
    <AccordionItem
      _hover={{ bg: "gray.700" }}
      bg="gray.800"
      borderRadius={8}
      flexDirection="column"
      gap={1}
      p={{ base: 3, md: 4 }}
      transition="all .25s ease-in-out"
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            _hover={{ bg: "transparent" }}
            alignItems="flex-start"
            flexDirection="column"
            onClick={() =>
              trackUseExpand({
                action: !isExpanded ? "expand" : "collapse",
                component: "module_function_accordion",
                info: { functionType: isView ? "view" : "execute" },
                section: fnType,
              })
            }
          >
            <Flex gap={2} justifyContent="space-between" w="full">
              <Flex alignItems="flex-start" direction="column" gap={1}>
                <Flex alignItems="center" gap={1}>
                  <Flex alignItems="center" gap={{ base: 0, md: 1 }}>
                    <CustomIcon
                      boxSize={3}
                      color={fnColor}
                      name={isView ? "query" : "execute"}
                    />
                    <Text color={fnColor} variant="body3">
                      {isView ? "View" : "Execute"}
                    </Text>
                  </Flex>
                  <DotSeparator
                    bg="gray.600"
                    display={{ base: "flex", md: "none" }}
                    ml={1}
                  />
                  {isMobile && <VisibilityLabel visibility={visibility} />}
                </Flex>
                <Text
                  color="text.main"
                  textAlign="left"
                  variant="body2"
                  wordBreak="break-word"
                >
                  {name}
                </Text>
              </Flex>
              <Flex alignItems="center" gap={{ base: 0, md: 4 }}>
                {!isMobile && <VisibilityLabel visibility={visibility} />}
                <FunctionButton
                  address={address}
                  disabled={disabled}
                  exposedFn={exposedFn}
                  fnType={fnType}
                  isView={isView}
                  moduleName={moduleName}
                />
                <StyledIconButton
                  _hover={{ backgroundColor: "gray.700" }}
                  aria-label="external"
                  icon={
                    <CustomIcon
                      name="chevron-down"
                      transform={isExpanded ? "rotate(180deg)" : "rotate(0)"}
                      transition="all .25s ease-in-out"
                    />
                  }
                  variant="none"
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
