// This file has been migrated to use PostgreSQL backend instead of Supabase
// All authentication now happens through API endpoints

export const api = {
  async signUp(email: string, password: string, fullName?: string) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });
    return response.json();
  },

  async signIn(email: string, password: string) {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  async signOut() {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }
};