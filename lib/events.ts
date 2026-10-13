// Panelləri açmaq üçün qlobal hadisələr — yüngül komponentlər ağır panelləri import etmədən istifadə edir
export const OPEN_TERMINAL_EVENT = "open-terminal";
export const OPEN_SHORTCUTS_EVENT = "open-shortcuts";

export const openTerminal = () => window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT));
export const openShortcuts = () => window.dispatchEvent(new Event(OPEN_SHORTCUTS_EVENT));
