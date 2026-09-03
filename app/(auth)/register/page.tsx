import { AuthShell } from "@/frontend/layout/auth-shell";
import { RegisterForm } from "@/frontend/module/auth/component/register-form";

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
