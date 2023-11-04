import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const passwordHash = async (password: string) => {
  return await bcrypt.hash(password, saltOrRounds);
};

export const compareHash = async (
  hash: string,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
