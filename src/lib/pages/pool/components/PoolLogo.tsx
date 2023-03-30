import { Flex, Image } from "@chakra-ui/react";

export const PoolLogo = () => {
  const list = [
    "https://assets.alleslabs.dev/webapp-assets/asset/undefined-violet.svg",
    "https://assets.alleslabs.dev/webapp-assets/asset/undefined-white.svg",
    // "https://assets.alleslabs.dev/webapp-assets/asset/undefined-violet-light.svg",
  ];
  return (
    <Flex
      css={{
        ">:not(:first-child)": {
          marginLeft: "-12px",
        },
      }}
      width="96px"
      alignItems="center"
      justifyContent="center"
    >
      {list.map((url, i) => (
        <Image boxSize={10} src={url} zIndex={i * -1 + 2} />
      ))}
      <Flex
        width={10}
        height={10}
        borderRadius="full"
        backgroundColor="pebble.700"
        alignItems="center"
        justifyContent="center"
      >
        +1
      </Flex>
    </Flex>
  );
};
