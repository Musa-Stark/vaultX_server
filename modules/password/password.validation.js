export const passwordValidation = (data) => {
  const { service, username, password, category, icon } = data;
  if (!service || !username || !password || !category || !icon)
    return "Service, username, password, category and icon are required";

  return null;
};
