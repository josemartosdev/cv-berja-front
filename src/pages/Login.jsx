import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes conectar la lógica de autenticación.
    console.log("Login submit", { email, password });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 sm:py-24 fondo-login">
      <div className="mx-auto w-full max-w-md">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Volver atrás
      </button>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Bienvenido</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Iniciar sesión</h1>
          <p className="text-sm leading-6 text-slate-300">
            Accede con tu correo electrónico y contraseña para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </div>
      </div>
    </main>
  );
}

export default Login;
