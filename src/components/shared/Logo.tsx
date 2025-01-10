import Image from "next/image";
import logoImage from "../../../public/images/logo/logo.png";

type Props = {
  width?: string;
  height?: string;
};

export default function Logo({ height, width }: Props) {
  return (
    <div className="z-50" style={{ width, height }}>
      <Image
        src={logoImage}
        alt="logo"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
}
