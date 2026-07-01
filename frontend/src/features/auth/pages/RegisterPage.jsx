import RegisterForm from "../components/RegisterForm";
import { Leaf } from "lucide-react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Floating Leaves */}
      <div className="absolute top-10 left-8 text-7xl opacity-10 select-none pointer-events-none animate-[floatLeaf_12s_ease-in-out_infinite]">
        🍃
      </div>
      <div className="absolute top-1/3 right-12 text-5xl opacity-10 select-none pointer-events-none animate-[floatLeaf_9s_ease-in-out_infinite]" style={{ animationDelay: "2s" }}>
        🌱
      </div>
      <div className="absolute bottom-12 left-1/4 text-9xl opacity-10 select-none pointer-events-none animate-[floatLeaf_15s_ease-in-out_infinite]" style={{ animationDelay: "4s" }}>
        🌿
      </div>

      {/* Gradient mesh overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(at 30% 20%, rgba(34,197,94,0.15) 0, transparent 50%), radial-gradient(at 70% 80%, rgba(251,191,36,0.08) 0, transparent 50%)",
        }}
      />

      <div className="w-full max-w-md relative z-10 animate-[slideInUp_0.8s_ease-out]">

        {/* Hero Logo with Lucide Leaf */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 mb-4 animate-[pulse_3s_ease-in-out_infinite]">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-sm">
            KisanAI
          </h1>
          <p className="text-green-100/90 text-sm mt-2 font-medium">
            Join thousands of smart farmers.
          </p>
        </div>

        <div className="bg-white/85 backdrop-blur-xl rounded-[32px] p-8 border border-white/40 shadow-2xl shadow-green-950/40">
          <h2 className="text-2xl font-extrabold text-green-950 mb-6 tracking-tight">
            Create Account
          </h2>
          <RegisterForm />
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
