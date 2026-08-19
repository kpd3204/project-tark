export async function callGemini(prompt: string): Promise<string> {
  // AI generation belongs behind a server-side endpoint. Until one is configured,
  // callers use their built-in fallback content rather than exposing a browser key.
  void prompt;
  return '';
}
