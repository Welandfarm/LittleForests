// API client for server communication
const API_BASE = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
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
}

export const apiClient = new ApiClient();