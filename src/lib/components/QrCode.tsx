import { Box } from "@chakra-ui/react";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";

const QrCode = ({ address }: { address: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const computedStyle = getComputedStyle(ref.current);
    const color =
      computedStyle.getPropertyValue("--chakra-colors-gray-100") ||
      computedStyle.getPropertyValue("--gray-0") ||
      "#f5f5f5";

    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        backgroundOptions: { color: "transparent" },
        cornersDotOptions: { color, type: "dot" },
        cornersSquareOptions: { color, type: "extra-rounded" },
        data: address,
        dotsOptions: { color, type: "dots" },
        height: 400,
        image: "https://registry.initia.xyz/images/INIT.png",
        imageOptions: { crossOrigin: "anonymous", margin: 4 },
        margin: 0,
        qrOptions: { errorCorrectionLevel: "H", mode: "Byte" },
        type: "canvas",
        width: 400,
      });

      qrCode.current.append(ref.current);
    } else {
      qrCode.current.update({
        data: address,
      });
    }
  }, [address]);

  return (
    <Box
      h="200px"
      sx={{ "& canvas": { height: "100%", width: "100%" } }}
      w="200px"
      ref={ref}
    />
  );
};

export default QrCode;
