import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { InsertUser } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().min(1, "Role is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      location: "",
      phoneNumber: "",
      role: "farmer",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle registration form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data as InsertUser);
  };

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">AgriNet</h1>
            <p className="text-gray-600">
              {isRegistering
                ? t("auth.createAccount")
                : t("auth.welcomeBack")}
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex border-b border-gray-200 w-full">
              <button
                className={`py-2 w-1/2 font-medium text-center ${
                  !isRegistering
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setIsRegistering(false)}
              >
                {t("auth.login")}
              </button>
              <button
                className={`py-2 w-1/2 font-medium text-center ${
                  isRegistering
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setIsRegistering(true)}
              >
                {t("auth.register")}
              </button>
            </div>
          </div>

          {isRegistering ? (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="reg-username">
                  {t("auth.username")}
                </label>
                <input
                  id="reg-username"
                  type="text"
                  {...registerForm.register("username")}
                  className={`w-full px-3 py-2 border ${
                    registerForm.formState.errors.username
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {registerForm.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="reg-password">
                  {t("auth.password")}
                </label>
                <input
                  id="reg-password"
                  type="password"
                  {...registerForm.register("password")}
                  className={`w-full px-3 py-2 border ${
                    registerForm.formState.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                  {t("auth.name")}
                </label>
                <input
                  id="name"
                  type="text"
                  {...registerForm.register("name")}
                  className={`w-full px-3 py-2 border ${
                    registerForm.formState.errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="location">
                  {t("auth.location")}
                </label>
                <select
                  id="location"
                  {...registerForm.register("location")}
                  className={`w-full px-3 py-2 border ${
                    registerForm.formState.errors.location
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                >
                  <option value="">Select location</option>
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Ahmednagar">Ahmednagar</option>
                </select>
                {registerForm.formState.errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="phoneNumber">
                  {t("auth.phone")}
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  {...registerForm.register("phoneNumber")}
                  className={`w-full px-3 py-2 border ${
                    registerForm.formState.errors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {registerForm.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t("auth.role")}
                </label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="farmer"
                      {...registerForm.register("role")}
                      defaultChecked
                      className="mr-2"
                    />
                    {t("auth.role.farmer")}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="buyer"
                      {...registerForm.register("role")}
                      className="mr-2"
                    />
                    {t("auth.role.buyer")}
                  </label>
                </div>
                {registerForm.formState.errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.role.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition duration-300"
              >
                {registerMutation.isPending
                  ? "Processing..."
                  : t("auth.register")}
              </button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="username">
                  {t("auth.username")}
                </label>
                <input
                  id="username"
                  type="text"
                  {...loginForm.register("username")}
                  className={`w-full px-3 py-2 border ${
                    loginForm.formState.errors.username
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {loginForm.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                  {t("auth.password")}
                </label>
                <input
                  id="password"
                  type="password"
                  {...loginForm.register("password")}
                  className={`w-full px-3 py-2 border ${
                    loginForm.formState.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition duration-300"
              >
                {loginMutation.isPending
                  ? "Logging in..."
                  : t("auth.login")}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right side: Hero */}
      <div className="w-full md:w-1/2 bg-primary hidden md:flex items-center justify-center p-8">
        <div className="text-white max-w-lg">
          <h2 className="text-3xl font-bold mb-6">
            {t("auth.hero.title")}
          </h2>
          <p className="text-xl mb-8">
            {t("auth.hero.description")}
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary-dark p-2 rounded-full mr-4">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {t("auth.hero.feature1.title")}
                </h3>
                <p>{t("auth.hero.feature1.description")}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-dark p-2 rounded-full mr-4">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {t("auth.hero.feature2.title")}
                </h3>
                <p>{t("auth.hero.feature2.description")}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-dark p-2 rounded-full mr-4">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {t("auth.hero.feature3.title")}
                </h3>
                <p>{t("auth.hero.feature3.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}