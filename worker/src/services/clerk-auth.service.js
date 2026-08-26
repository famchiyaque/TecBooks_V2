import { createClerkClient } from '@clerk/backend';

function getClerkClient(env) {
  return createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
}

// One-time-use ticket (Clerk "Sign-in Tokens"): our backend already
// verified the password, so we ask Clerk to build the session without
// asking for credentials again. The frontend redeems it with @clerk/clerk-react.
export async function createClerkSignInTicket(env, clerkUserId) {
  if (!env.CLERK_SECRET_KEY || !clerkUserId) return null;

  const clerkClient = getClerkClient(env);
  const signInToken = await clerkClient.signInTokens.createSignInToken({
    userId: clerkUserId,
    expiresInSeconds: 60,
  });
  return signInToken.token;
}

export async function createClerkUserAccount(env, { email, password, firstName, lastName }) {
  const clerkClient = getClerkClient(env);

  try {
    return await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
    });
  } catch (caughtError) {
    const errorCode = caughtError.errors?.[0]?.code;

    if (errorCode === 'form_identifier_exists') {
      const appError = new Error('email_already_registered');
      appError.status = 409;
      throw appError;
    }
    if (errorCode?.startsWith('form_password_')) {
      const appError = new Error('weak_password');
      appError.status = 422;
      throw appError;
    }
    const appError = new Error('signup_failed');
    appError.status = 500;
    throw appError;
  }
}
