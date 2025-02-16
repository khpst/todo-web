import * as jose from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const alg = 'HS256';

export const generateToken = async (userId: string): Promise<string> => {
  if (!userId) throw new Error('UserId is required');
  return await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET_KEY);
};

export const generateRefreshToken = async (userId: string): Promise<string> => {
  if (!userId) throw new Error('UserId is required');
  return await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
};

export const verifyToken = async (token: string) => {
  if (!token) throw new Error('Token is required');
  const { payload } = await jose.jwtVerify(token, SECRET_KEY, {
    algorithms: [alg]
  });
  return payload;
};

export const decode = async (token: string) => {
  if (!token) throw new Error('Token is required');
  const { payload } = await jose.jwtVerify(token, SECRET_KEY, {
    algorithms: [alg]
  });
  return payload;
}
