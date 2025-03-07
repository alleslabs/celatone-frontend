import { Flex, Text, Button, Link } from "@chakra-ui/react";
import dayjs from "dayjs";

export const MigrationBanner = () => {
  const date = dayjs
    .utc(new Date("2025-03-18T03:00:00Z"))
    .local()
    .format("M/DD/YYYY, h:mm:ss A [(local time)]");

  return (
    <Flex
      py={{
        base: 3,
        md: 2,
      }}
      px={3}
      bg="#cc4949"
      justifyContent="center"
      flexDirection={{ base: "column", md: "row" }}
      fontFamily="Pilat Wide"
      gap={{
        base: 2,
        md: 6,
      }}
      alignItems={{
        base: "flex-end",
        md: "center",
      }}
      height={{
        base: "125px",
        md: "60px",
      }}
    >
      <Text fontSize={{ base: "12px", lg: "14px" }} fontWeight={600}>
        Initia Wallet extension is being deprecated. Existing extension users
        must migrate before {date} to be eligible for future incentives.
      </Text>
      <Link
        href="https://migration.initia.xyz"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
        }}
      >
        <Button
          size="sm"
          variant="outline-gray"
          borderColor="gray.100"
          py={1}
          px={4}
          color="gray.100"
          fontWeight={600}
          borderRadius="full"
          background="rgba(0,0,0, 0.7)"
          _hover={{
            background: "rgba(0,0,0, 0.3)",
          }}
          rightIcon={
            <video
              autoPlay
              muted
              playsInline
              loop
              src="/arrow.webm"
              style={{ width: 12, height: 12 }}
            />
          }
        >
          Migrate Wallet
        </Button>
      </Link>
    </Flex>
  );
};
