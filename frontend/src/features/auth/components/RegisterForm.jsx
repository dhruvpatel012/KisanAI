import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterForm = () => {
  const { register: registerUser, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    await registerUser(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Alert message={error} type="error" />

      <Input
        label="Full Name"
        type="text"
        placeholder="Dhruv Patel"
        register={register("full_name")}
        error={errors.full_name?.message}
        variant="line"
        icon={<User size={16} />}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="farmer@example.com"
        register={register("email")}
        error={errors.email?.message}
        variant="line"
        icon={<Mail size={16} />}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Create a password (min 6 chars)"
        register={register("password")}
        error={errors.password?.message}
        variant="line"
        icon={<Lock size={16} />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <Button
        type="submit"
        loading={loading}
        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-95 border-none text-white font-bold py-3 rounded-xl transition-all"
      >
        Create Account →
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-green-700 font-bold hover:text-green-800 transition-colors"
        >
          Sign in here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
