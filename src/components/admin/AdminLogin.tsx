import React, { useState } from "react";
import { Lock, ShieldCheck, AlertCircle, Coffee } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Exact Credential Validation
    if (username.trim() === "akashdeep" && password === "akash98728") {
      sessionStorage.setItem("coffizza_admin_logged_in", "true");
      onLoginSuccess();
    } else {
      setErrorMsg("ਗਲਤ ਯੂਜ਼ਰਨੇਮ ਜਾਂ ਪਾਸਵਰਡ! (Invalid Username or Password)");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-amber-100 tracking-tight">
            Coffizza Admin Portal
          </h1>
          <p className="text-xs text-stone-400">
            Enter authorized credentials to access order data & reservations.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form
          onSubmit={handleLogin}
          autoComplete="off"
          noValidate
          className="space-y-4"
        >
          {/* Prevent hidden autofill tricks */}
          <input type="text" className="hidden" name="fakeusernameremembered" />
          <input type="password" className="hidden" name="fakepasswordremembered" />

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="admin_user_field_no_autofill"
                id="admin_user_field"
                autoComplete="off"
                aria-autocomplete="none"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500 focus:outline-none transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="admin_pwd_field_no_autofill"
                id="admin_pwd_field"
                autoComplete="new-password"
                aria-autocomplete="none"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500 focus:outline-none transition font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Login to Portal</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-stone-500 hover:text-stone-300 transition">
            ← Return to Coffizza Main Website
          </a>
        </div>
      </div>
    </div>
  );
};
