// ============================================================
// components/AuthLayout.jsx – minimal layout för auth-sidor
// ============================================================
// Centrerad layout med NexaPay-titel och valfri subtitel.
// Används av Login, Register, ForgotPassword, ResetPassword
// och ConfirmEmail där vi inte vill visa sidebar/topbar.
// ============================================================

export default function AuthLayout({ subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white text-center mb-2">NexaPay</h1>
        {subtitle && <p className="text-gray-400 text-center mb-8">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}
