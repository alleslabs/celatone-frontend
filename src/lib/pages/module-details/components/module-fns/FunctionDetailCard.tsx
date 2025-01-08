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
  address: IndexedModule["address"];
  exposedFn: ExposedFunction;
  fnType: FunctionTypeTabIndex;
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
      name={getVisibilityIcon(visibility)}
      boxSize={3}
      color="gray.600"
    />
    <Text variant="body3" color="text.dark" textTransform="capitalize">
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
  address: string;
  disabled: boolean;
  exposedFn: ExposedFunction;
  fnType: FunctionTypeTabIndex;
  isView: boolean;
  moduleName: string;
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
          : "Only execute functions with “is_entry: true” and “visibility: public” are interactable through Celatone’s module interactions."
      }
    >
      <Button
        isDisabled={disabled || (isMobile && !isView)}
        minW={{ md: 24 }}
        size="sm"
        variant={getButtonStyle().variant}
        borderColor={getButtonStyle().color}
        leftIcon={
          <CustomIcon
            mx={0}
            name={isView ? "query" : "execute"}
            boxSize={3}
            color={getButtonStyle().color}
          />
        }
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
        <Text mt="2px" color={getButtonStyle().color}>
          {isView ? "View" : "Execute"}
        </Text>
      </Button>
    </Tooltip>
  );
};

const FunctionDetail = ({ exposedFn }: { exposedFn: ExposedFunction }) => (
  <AccordionPanel bg="gray.900" mt={4} px={4} py={3} borderRadius={8}>
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
              ml={0}
              name={getVisibilityIcon(exposedFn.visibility)}
              boxSize={3}
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
              ml={0}
              name={exposedFn.is_entry ? "check" : "close"}
              boxSize={3}
              color={exposedFn.is_entry ? "success.main" : "gray.600"}
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
              ml={0}
              name={exposedFn.is_view ? "check" : "close"}
              boxSize={3}
              color={exposedFn.is_view ? "success.main" : "gray.600"}
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
      bg="gray.800"
      gap={1}
      p={{ base: 3, md: 4 }}
      _hover={{ bg: "gray.700" }}
      borderRadius={8}
      flexDirection="column"
      transition="all .25s ease-in-out"
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            alignItems="flex-start"
            _hover={{ bg: "transparent" }}
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
            <Flex gap={2} w="full" justifyContent="space-between">
              <Flex alignItems="flex-start" gap={1} direction="column">
                <Flex alignItems="center" gap={1}>
                  <Flex alignItems="center" gap={{ base: 0, md: 1 }}>
                    <CustomIcon
                      name={isView ? "query" : "execute"}
                      boxSize={3}
                      color={fnColor}
                    />
                    <Text variant="body3" color={fnColor}>
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
                  textAlign="left"
                  variant="body2"
                  color="text.main"
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
                  fnType={fnType}
                  isView={isView}
                  exposedFn={exposedFn}
                  moduleName={moduleName}
                />
                <StyledIconButton
                  aria-label="external"
                  variant="none"
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
