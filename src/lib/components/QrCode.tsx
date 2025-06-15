import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";

const qrCode = new QRCodeStyling({
  backgroundOptions: {
    color: "#ffffff",
  },
  dotsOptions: {
    color: "#000000",
    type: "square",
  },
  height: 230,
  imageOptions: {
    crossOrigin: "anonymous",
    imageSize: 0.5,
    margin: 10,
  },
  width: 230,
});

interface QrCodeProps {
  data: string;
  image?: string;
}

const QrCode = ({ data, image }: QrCodeProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    if (ref.current) qrCode.update({ data, image });
  }, [data, image]);

  return <div ref={ref} />;
};

export default QrCode;
