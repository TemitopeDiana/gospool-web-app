import Image from "next/image";

export default function Home() {
  return (
    <div className="grid place-items-center h-screen">
      <div className="text-center">
        <div className="relative aspect-video w-full mx-auto max-w-52">
          <Image
            src='/assets/gospool-logo-green.png'
            alt="gospool logo"
            fill
            sizes="100%"
            className="object-contain"
          />
        </div>
        <p className="font-bold text-3xl">Welcome to the Gospool admin app</p>
      </div>
    </div>
  );
}
