import { verifySession } from "@/app/lib/dal";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const session = await verifySession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {JSON.stringify(session, null, 2)}
    </div>
  );
}
