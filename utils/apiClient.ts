import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private readonly apiKey?: string
  ) {}

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    return headers;
  }

  async createEmployeeLikeRecord(
    firstName: string,
    lastName: string,
    job: string
  ) {
    const response = await this.request.post(
      `${this.baseUrl}/api/users`,
      {
        headers: {
          ...this.headers(),
          'Content-Type': 'application/json'
        },
        data: {
          name: `${firstName} ${lastName}`,
          job
        }
      }
    );

    expect(
      response.status(),
      'API create should return 201'
    ).toBe(201);

    return response.json();
  }

  async updateEmployeeLikeRecord(
    id: string,
    name: string,
    job: string
  ) {
    const response = await this.request.put(
      `${this.baseUrl}/api/users/${id}`,
      {
        headers: {
          ...this.headers(),
          'Content-Type': 'application/json'
        },
        data: {
          name,
          job
        }
      }
    );

    expect(
      response.status(),
      'API update should return 200'
    ).toBe(200);

    return response.json();
  }

  async deleteEmployeeLikeRecord(id: string) {
    const response = await this.request.delete(
      `${this.baseUrl}/api/users/${id}`,
      {
        headers: this.headers()
      }
    );

    expect(
      response.status(),
      'API delete should return 204'
    ).toBe(204);
  }
}