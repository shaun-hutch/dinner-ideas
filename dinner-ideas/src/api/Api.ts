import { ApiEndpoint } from "../models/Constants";
import { DinnerItem } from "../models/DinnerItem";

const baseEndpoint = `${ApiEndpoint}/dinner-ideas-db`;

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("dinner-ideas-token");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

export const getAll = async (): Promise<DinnerItem[]> => {
    const response = await fetch(baseEndpoint, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
};

export const update = async (item: DinnerItem): Promise<DinnerItem> => {
    const response = await fetch(baseEndpoint, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
};

export const add = async (item: DinnerItem): Promise<DinnerItem> => {
    const response = await fetch(baseEndpoint, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
};

export const generateItems = async (count: number): Promise<DinnerItem[]> => {
    const response = await fetch(`${baseEndpoint}/generate`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ count })
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
};

export const getUploadUrl = async (
    dinnerItemId: string,
    fileName: string,
    contentType: string
): Promise<{ uploadUrl: string; imageKey: string; imageUrl: string }> => {
    const response = await fetch(`${baseEndpoint}/upload-url`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ dinnerItemId, fileName, contentType })
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
};

export const uploadToS3 = async (uploadUrl: string, file: File): Promise<void> => {
    const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
};

// Auth API
interface AuthResponse {
    token: string;
    user: { id: string; email: string };
}

export const register = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${baseEndpoint}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Registration failed" }));
        throw new Error(err.error || "Registration failed");
    }
    return response.json();
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${baseEndpoint}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Login failed" }));
        throw new Error(err.error || "Login failed");
    }
    return response.json();
};
