import Image from "next/image";

const Logo = () => (
  <div className="flex items-center gap-2 ">
    <Image src="/diamond.png" alt="JewellPlus Logo" width={32} height={32} />
    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700 text-3xl font-bold">
      JewellPlus
    </h1>
  </div>
);

export default Logo;
