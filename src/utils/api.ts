import type {
  AboutConfig,
  DocumentationItem,
  LandingConfig,
  ProjectItem,
  SiteContent,
} from '../types.ts';

const TOKEN_STORAGE_KEY = 'vector_editor_token';
let memoryToken: string | null = null;

function getStoredToken(): string | null {
  if (memoryToken) return memoryToken;
  try {
    const localToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (localToken) {
      memoryToken = localToken;
      return localToken;
    }
  } catch {
    // Ignore storage access errors in restricted iframes
  }
  try {
    const sessionToken = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (sessionToken) {
      memoryToken = sessionToken;
      return sessionToken;
    }
  } catch {
    // Ignore storage access errors in restricted iframes
  }
  return null;
}

function setStoredToken(token: string | null): void {
  memoryToken = token;
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors in restricted iframes
  }
  try {
    if (token) {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors in restricted iframes
  }
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string> | undefined) || {}),
  };
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
    ...options,
    headers,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && url !== '/api/auth/login') {
      setStoredToken(null);
    }
    throw new Error(
      typeof data?.error === 'string'
        ? data.error
        : `Request failed (${response.status})`
    );
  }
  return data as T;
}

export async function fetchSiteContent(): Promise<SiteContent> {
  return requestJson<SiteContent>('/api/content');
}

export async function fetchAuthSession(): Promise<{ authenticated: boolean }> {
  return requestJson<{ authenticated: boolean }>('/api/auth/session');
}

export async function loginEditorPin(
  pin: string
): Promise<{ authenticated: boolean; token?: string }> {
  const res = await requestJson<{ authenticated: boolean; token?: string }>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ pin }),
    }
  );
  if (res.authenticated && res.token) {
    setStoredToken(res.token);
  }
  return res;
}

export async function logoutEditor(): Promise<{ authenticated: boolean }> {
  setStoredToken(null);
  return requestJson<{ authenticated: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
}

export async function saveLandingConfig(
  landing: LandingConfig
): Promise<{ content: SiteContent }> {
  return requestJson<{ content: SiteContent }>('/api/content/landing', {
    method: 'PUT',
    body: JSON.stringify(landing),
  });
}

export async function saveAboutConfig(
  about: AboutConfig
): Promise<{ content: SiteContent }> {
  return requestJson<{ content: SiteContent }>('/api/content/about', {
    method: 'PUT',
    body: JSON.stringify(about),
  });
}

export async function createProject(
  project: Omit<ProjectItem, 'id' | 'slug'> & { id?: string; slug?: string }
): Promise<{ content: SiteContent; project: ProjectItem }> {
  return requestJson<{ content: SiteContent; project: ProjectItem }>(
    '/api/projects',
    {
      method: 'POST',
      body: JSON.stringify(project),
    }
  );
}

export async function updateProject(
  project: ProjectItem
): Promise<{ content: SiteContent; project: ProjectItem }> {
  return requestJson<{ content: SiteContent; project: ProjectItem }>(
    `/api/projects/${encodeURIComponent(project.id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(project),
    }
  );
}

export async function deleteProject(id: string): Promise<{ content: SiteContent }> {
  return requestJson<{ content: SiteContent }>(
    `/api/projects/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    }
  );
}

export async function createDocumentation(
  item: Omit<DocumentationItem, 'id'> & { id?: string }
): Promise<{ content: SiteContent; item: DocumentationItem }> {
  return requestJson<{ content: SiteContent; item: DocumentationItem }>(
    '/api/documentation',
    {
      method: 'POST',
      body: JSON.stringify(item),
    }
  );
}

export async function updateDocumentation(
  item: DocumentationItem
): Promise<{ content: SiteContent; item: DocumentationItem }> {
  return requestJson<{ content: SiteContent; item: DocumentationItem }>(
    `/api/documentation/${encodeURIComponent(item.id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(item),
    }
  );
}

export async function deleteDocumentation(
  id: string
): Promise<{ content: SiteContent }> {
  return requestJson<{ content: SiteContent }>(
    `/api/documentation/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    }
  );
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const res = await requestJson<{ url: string }>('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ dataUrl, fileName: file.name }),
  });
  return res.url;
}
