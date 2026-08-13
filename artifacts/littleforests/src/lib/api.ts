// API client for server communication
const API_BASE = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.detail || 'Request failed');
    }

    // Handle 204 No Content responses (like DELETE)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Profile methods
  async getProfile(id: string) {
    return this.request(`/profiles/${id}`);
  }

  async getProfileByEmail(email: string) {
    return this.request(`/profiles/email/${encodeURIComponent(email)}`);
  }

  async createProfile(profile: any) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async updateProfile(id: string, profile: any) {
    return this.request(`/profiles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(profile),
    });
  }

  async getProfiles() {
    return this.request('/profiles');
  }

  // Product methods
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(product: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Content methods
  async getContent(type?: string) {
    const params = type ? `?type=${encodeURIComponent(type)}` : '';
    return this.request(`/content${params}`);
  }

  async createContent(content: any) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async updateContent(id: string, content: any) {
    return this.request(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  async deleteContent(id: string) {
    return this.request(`/content/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact message methods
  async getContactMessages() {
    return this.request('/contact-messages');
  }

  async createContactMessage(message: any) {
    return this.request('/contact-messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async updateContactMessage(id: string, message: any) {
    return this.request(`/contact-messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(message),
    });
  }

  // Testimonial methods
  async getTestimonials() {
    return this.request('/testimonials');
  }

  async createTestimonial(testimonial: any) {
    return this.request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
  }

  async updateTestimonial(id: string, testimonial: any) {
    return this.request(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonial),
    });
  }

  async deleteTestimonial(id: string) {
    return this.request(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  // Gallery methods
  async getGallery(type: 'water-source' | 'green-champions') {
    return this.request(`/gallery/${type}`);
  }

  async getGalleryAll(type: 'water-source' | 'green-champions') {
    return this.request(`/gallery/${type}/all`);
  }

  async createGalleryItem(type: 'water-source' | 'green-champions', item: any) {
    return this.request(`/gallery/${type}`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateGalleryItem(type: 'water-source' | 'green-champions', id: string, item: any) {
    return this.request(`/gallery/${type}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteGalleryItem(type: 'water-source' | 'green-champions', id: string) {
    return this.request(`/gallery/${type}/${id}`, {
      method: 'DELETE',
    });
  }

  // Content & Social methods — all admin-gated, so include the stored
  // admin token as a Bearer header.
  private socialAuthHeaders() {
    const token = localStorage.getItem('admin-token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getSocialPosts() {
    return this.request('/social/posts', { headers: this.socialAuthHeaders() });
  }

  async createSocialPost(post: { title: string; source?: string; focus?: string; master: string; story?: string; date?: string }) {
    return this.request('/social/posts', {
      method: 'POST',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify(post),
    });
  }

  async updateSocialPost(id: string, post: any) {
    return this.request(`/social/posts/${id}`, {
      method: 'PATCH',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify(post),
    });
  }

  async deleteSocialPost(id: string) {
    return this.request(`/social/posts/${id}`, {
      method: 'DELETE',
      headers: this.socialAuthHeaders(),
    });
  }

  async generateChannelVersion(input: { postId: string; channel: string; title: string; master: string; story: string }) {
    return this.request('/social/generate', {
      method: 'POST',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify(input),
    });
  }

  async saveChannelVersion(postId: string, channel: string, content: string) {
    return this.request(`/social/posts/${postId}/versions/${channel}`, {
      method: 'PUT',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify({ content }),
    });
  }

  async approveChannelVersion(input: { postId: string; channel: string; content: string }) {
    return this.request('/social/approve', {
      method: 'POST',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify(input),
    });
  }

  async scheduleSocialPost(postId: string, date: string) {
    return this.request('/social/schedule', {
      method: 'POST',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify({ postId, date }),
    });
  }

  async publishToFacebook(postId: string, link?: string) {
    return this.request('/social/facebook/publish', {
      method: 'POST',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify({ postId, link }),
    });
  }

  async publishToInstagram(postId: string, imageUrl?: string) {
    return this.request('/social/instagram/publish', {
      method: 'POST',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify({ postId, imageUrl }),
    });
  }

  async sendWhatsApp(postId: string, to?: string) {
    return this.request('/social/whatsapp/send', {
      method: 'POST',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify({ postId, to }),
    });
  }

  async getWhatsAppShareLink(postId: string) {
    return this.request(`/social/whatsapp/share-link/${postId}`, { headers: this.socialAuthHeaders() });
  }

  async sendMarketingEmail(postId: string, to?: string) {
    return this.request('/social/email/send', {
      method: 'POST',
      headers: this.socialAuthHeaders(),
      body: JSON.stringify({ postId, to }),
    });
  }

  async getPublishLog() {
    return this.request('/social/publish-log', { headers: this.socialAuthHeaders() });
  }
}

export const apiClient = new ApiClient();