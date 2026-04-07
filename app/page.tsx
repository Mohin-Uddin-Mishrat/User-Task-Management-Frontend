import { AuthScreen } from "@/components/auth-screen";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[linear-gradient(160deg,#f8fafc_0%,#e0f2fe_45%,#fff7ed_100%)] px-6 py-16">
      <div className="w-full max-w-2xl md:p-8">
        <div className="flex items-center justify-center">
          <AuthScreen />
        </div>
      </div>
    </main>
  );
}
