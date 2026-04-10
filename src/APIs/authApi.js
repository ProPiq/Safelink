const users = [
  {
    id: '1',
    email: 'borrower@safelink.com',
    password: '123456',
    role: 'borrower',
    name: 'Borrower User',
  },
  {
    id: '2',
    email: 'lender@safelink.com',
    password: '123456',
    role: 'lender',
    name: 'Lender User',
  },
];

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}
