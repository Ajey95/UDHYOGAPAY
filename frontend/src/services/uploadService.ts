/**
 * Upload file to server
 */
export const uploadFile = async (file: File, type: 'avatar' | 'document'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  // Implementation depends on your backend
  // This is a placeholder
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.url;
};

/**
 * Upload multiple files
 */
export const uploadFiles = async (files: File[], type: string): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('type', type);

  const response = await fetch('/api/upload/multiple', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.urls;
};

/**
 * Delete file from server
 */
export const deleteFile = async (url: string): Promise<void> => {
  await fetch('/api/upload', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
};
