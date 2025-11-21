// src/lib/api.ts

export type UrlParams = Record<
    string,
    string | number | boolean | null | undefined
>;

export async function apiFetch<T = any>(
    url: string,
    params?: UrlParams,
    options: RequestInit = {},
): Promise<T> {
    const query = params
        ? Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) =>
                `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
            )
            .join("&")
        : "";

    const fetchUrl = query
        ? `${url}${url.includes("?") ? "&" : "?"}${query}`
        : url;

    const headers = {
        Accept: "application/json",
        ...(options.headers || {}),
    };

    const res = await fetch(fetchUrl, { ...options, headers });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
            `Request failed: ${res.status} ${res.statusText}${
                body ? ` - ${body}` : ""
            }`,
        );
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
}
