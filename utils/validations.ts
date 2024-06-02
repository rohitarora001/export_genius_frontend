const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string) => {
  return emailRegex.test(email);
};
export const isValidPassword = (password: string) => {
  return password.length >= 8;
};
