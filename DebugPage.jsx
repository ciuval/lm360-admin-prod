import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DebugPage() {
  const [email, setEmail] = useState("vale-test@example.com");
  const [password, setPassword] = useState("ValeTest123!");
  const [output, setOutput] = useState("");

  const testLogin = async () => {
    setOutput("⏳ Login in corso...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setOutput(`❌ Errore login: ${error.message}`);
    setOutput(`✅ Login OK: ${data.user.email}`);
  };

  const testProfilo = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setOutput("❌ Nessun utente loggato");

    const { data, error } = await supabase
      .from("profili")
      .select("*")
      .eq("id", user.id);

    if (error) return setOutput(`❌ Errore profilo: ${error.message}`);
    setOutput(`📘 Profilo trovato: ${JSON.stringify(data, null, 2)}`);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return setOutput(`❌ Logout fallito: ${error.message}`);
    setOutput("✅ Logout effettuato");
    setTimeout(() => {
      window.location.reload(); // oppure: window.location.href = "/#/"
    }, 1000);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">🧪 Debug Login + RLS</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-600"
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-600"
        placeholder="Password"
      />

      <div className="flex gap-4 mb-4">
        <button
          onClick={testLogin}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          🔐 Login
        </button>
        <button
          onClick={testProfilo}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          📘 Test Profilo
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          🔓 Logout
        </button>
      </div>

      <pre className="whitespace-pre-wrap bg-gray-900 p-4 rounded text-sm border border-gray-700">
        {output}
      </pre>
    </div>
  );
}
