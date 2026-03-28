import * as FileSystem from 'expo-file-system';

export async function imageUriToBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    throw new Error(`Failed to convert image to base64: ${error}`);
  }
}

export async function compressImage(uri: string): Promise<string> {
  // For now, just return the original URI
  // In future, implement actual compression
  return uri;
}
