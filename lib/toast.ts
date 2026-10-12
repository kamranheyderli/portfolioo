// Saytın istənilən yerindən qısa bildiriş göstərmək üçün
export const TOAST_EVENT = "site-toast";

export function toast(text: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: text }));
}
