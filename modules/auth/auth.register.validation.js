export const registerValidation = (data) => {
  const { name, email, password, masterPassword } = data;

  if (!name || !email || !password || !masterPassword)
    return "Name, email, password and master password are required";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Invalid email format";

  if (password.length < 6) return "Password must be at least 6 characters";

  if (masterPassword.length < 6)
    return "Master password must be at least 6 characters";

  return null;
};
