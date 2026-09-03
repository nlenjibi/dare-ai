import { AuthShell } from "@/frontend/layout/auth-shell";
import { LoginForm } from "@/frontend/module/auth/component/login-form";

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
