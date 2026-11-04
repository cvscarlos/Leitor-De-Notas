declare namespace API {
  type OauthProvider = 'google' | 'facebook' | 'microsoft';

  type SessionItem = { email: string; sessionId: string; expiresAt: number };
}
