interface GetAccessToken {
  (): string;
}

export default class HttpClient {
  getAccessToken: GetAccessToken;

  public constructor(getAccessToken: GetAccessToken) {
    this.getAccessToken = getAccessToken;
  }

  async get<T>(url: string): Promise<T> {
    let headers: any = {
      "Content-Type": "application/json",
    };

    const accessToken = this.getAccessToken();

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(process.env.API_SERVER + "/api" + url, {
      method: "GET",
      headers: headers,
    });

    if (response.status === 404) {
      throw new NotFoundError("Not found", response.status);
    }

    if (!response.ok) {
      throw new InternalServerError("Internal server error", response.status);
    }

    return response.json();
  }

  async post<T, R>(url: string, data: T): Promise<R> {
    let headers: any = {
      "Content-Type": "application/json",
    };

    const accessToken = this.getAccessToken();

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(process.env.API_SERVER + "/api" + url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.status === 404) {
      throw new NotFoundError("Not found", response.status);
    }

    if (!response.ok) {
      throw new InternalServerError("Internal server error", response.status);
    }

    return response.json();
  }
}

export class ErrorResponse {
  constructor(
    public message: string,
    public status: number,
  ) {}
}

export class NotFoundError extends ErrorResponse {}

export class InternalServerError extends ErrorResponse {}
