import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Image
        src="/logo.png"
        alt="Logo da PucTech"
        width={160}
        height={160}
        priority
        className="rounded-2xl"
      />
      <h1 className="text-4xl font-bold">
        PUC<span className="font-light italic text-brand-200">Tech</span>
      </h1>
      <p className="text-brand-200">Liga Academia de Tecnologia da PUC-SP</p>
    </main>
  );
}