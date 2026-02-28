export const loginValidation = (data) => {
  const { name, email, password, masterPassword } = data;

  if (!email || !password) return "Email and password are required";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Invalid email format";

  if (password.length < 6) return "Invalid password";

  return null;
};
