import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterForm = () => {
  const { register: registerUser, loading, error } = useAuth();

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
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="farmer@example.com"
        register={register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password (min 6 chars)"
        register={register("password")}
        error={errors.password?.message}
      />

      <Button type="submit" loading={loading}>
        Create Account →
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-brand-600 font-semibold hover:text-brand-700"
        >
          Sign in here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
