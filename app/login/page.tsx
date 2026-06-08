import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="px-4 py-10">
      <AuthForm mode="login" />
    </main>
  );
}
