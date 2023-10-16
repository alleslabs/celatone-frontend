import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  IconButton,
  Text,
  chakra,
} from "@chakra-ui/react";

import { DotSeparator } from "../DotSeparator";
import { CustomIcon } from "../icon";
import { LabelText } from "../LabelText";
import { Tooltip } from "../Tooltip";
import { useInternalNavigate } from "lib/app-provider";
import type { IndexedModule } from "lib/services/move/moduleService";
import type { ExposedFunction } from "lib/types";
import { checkAvailability, getVisibilityIcon } from "lib/utils";

interface FunctionDetailCardProps {
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

const FunctionDetail = ({ exposedFn }: { exposedFn: ExposedFunction }) => {
  return (
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
};

export const FunctionDetailCard = ({
  exposedFn,
  address,
  moduleName,
}: FunctionDetailCardProps) => {
  const { is_view: isView, visibility, name } = exposedFn;
  const disabled = !checkAvailability(exposedFn);
  const navigate = useInternalNavigate();
  const getFnColor = () => {
    switch (isView) {
      case false:
        return "accent.main";
      case true:
      default:
        return "primary.main";
    }
  };

  const getButtonStyle = () => {
    if (disabled) return { variant: "outline-gray", color: "gray.500" };
    if (isView) return { variant: "outline-primary", color: "primary.dark" };
    return { variant: "outline-accent", color: "accent.dark" };
  };

  return (
    <AccordionItem
      bg="gray.800"
      _hover={{ bg: "gray.700" }}
      borderRadius={8}
      p={4}
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
            onClick={() => ({
              action: !isExpanded ? "expand" : "collapse",
              component: "unsupported_pool",
              section: "pool-list-page",
            })}
          >
            <Flex justifyContent="space-between" w="full">
              <Flex direction="column" gap={1} alignItems="flex-start">
                <Flex gap={1} alignItems="center">
                  <CustomIcon
                    name={isView ? "query" : "execute"}
                    color={getFnColor()}
                    boxSize={3}
                  />
                  <Text variant="body3" color={getFnColor()}>
                    {isView ? "View" : "Execute"}
                  </Text>
                </Flex>
                <Text
                  variant="body2"
                  color={disabled ? "text.disabled" : "text.main"}
                >
                  {name}
                </Text>
              </Flex>
              <Flex alignItems="center" gap={4}>
                <Flex alignItems="center" gap={2}>
                  <Tooltip
                    bg="primary.dark"
                    label="Only execute functions with “is_entry: true” and “visibility: public” are interactable through Celatone’s module interactions."
                  >
                    <Flex
                      pointerEvents="auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Flex gap={1} alignItems="center">
                        {disabled ? (
                          <CustomIcon
                            name="close"
                            color="gray.600"
                            boxSize={3}
                          />
                        ) : (
                          <CustomIcon
                            name="check"
                            color="success.main"
                            boxSize={3}
                          />
                        )}
                        <Text variant="body3" color="text.dark">
                          is_entry
                        </Text>
                      </Flex>
                    </Flex>
                  </Tooltip>
                  <DotSeparator bg="gray.600" />
                  <Flex alignItems="center" gap={1}>
                    <CustomIcon
                      name={getVisibilityIcon(visibility)}
                      color="gray.600"
                      boxSize={3}
                    />
                    <Text
                      variant="body3"
                      color="text.dark"
                      textTransform="capitalize"
                    >
                      {visibility}
                    </Text>
                  </Flex>
                </Flex>
                <Button
                  variant={getButtonStyle().variant}
                  isDisabled={disabled}
                  borderColor={getButtonStyle().color}
                  size="sm"
                  onClick={() =>
                    navigate({
                      pathname: "/interact",
                      query: {
                        address,
                        moduleName,
                        functionType: isView ? "view" : "execute",
                        functionName: exposedFn.name,
                      },
                    })
                  }
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
