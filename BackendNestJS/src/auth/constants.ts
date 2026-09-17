if (!process.env.JWT_SECRET) {
  console.warn(
    '⚠️  JWT_SECRET no está definido en el entorno; usando un secreto de desarrollo. ' +
      'Configúralo en producción o los tokens dejarán de ser válidos en cada reinicio.',
  );
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'dev-only-fallback-secret',
};
