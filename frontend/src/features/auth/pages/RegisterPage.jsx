import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            KisanAI
          </h1>
          <p className="text-gray-500 mt-1">
            Join thousands of smart farmers.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Create Account
          </h2>
          <RegisterForm />
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
