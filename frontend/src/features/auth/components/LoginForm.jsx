import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginForm = () => {
  const { login, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    await login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Alert message={error} type="error" />

      <Input
        label="Email Address"
        type="email"
        placeholder="farmer@example.com"
        register={register("email")}
        error={errors.email?.message}
        variant="line"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register("password")}
        error={errors.password?.message}
        variant="line"
      />

      <Button
        type="submit"
        loading={loading}
        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-95 border-none text-white font-bold py-3 rounded-xl transition-all"
      >
        Sign In →
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-green-700 font-bold hover:text-green-800 transition-colors"
        >
          Register here
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
