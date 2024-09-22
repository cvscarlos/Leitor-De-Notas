declare namespace API {
  type BinanceResponse = { errors: string[]; results: Record<string, string | number>[] };

  type OauthProvider = 'google' | 'facebook' | 'microsoft';

  type SessionItem = { email: string; sessionId: string; expiresAt: number };
}
