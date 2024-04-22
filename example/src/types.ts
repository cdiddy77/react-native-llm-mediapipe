export interface Message {
  role: "system" | "user" | "assistant" | "error";
  content: string;
  name?: string;
}
