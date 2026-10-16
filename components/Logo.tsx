import Image from "next/image";

// Logo em tinta escura no tema claro e o original (branco → ciano) no escuro.
export default function Logo({ className = "", alt = "PUC Tech", eager = false }: { className?: string; alt?: string; eager?: boolean }) {
  const props = { width: 310, height: 82, loading: eager ? ("eager" as const) : undefined };
  return (
    <>
      <Image src="/logo-puctech-ink.svg" alt={alt} {...props} className={`${className} dark:hidden`} />
      <Image src="/logo-puctech.svg" alt={alt} {...props} className={`${className} hidden dark:block`} />
    </>
  );
}
