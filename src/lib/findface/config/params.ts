declare function parseInt(value: unknown): number;

export const CC_FINDFACE_BRIDGE_PORT = parseInt(process.env.CC_FINDFACE_BRIDGE_PORT) || 20050;

export const CC_FINDFACE_URL = process.env.CC_FINDFACE_URL || "http://192.168.14.55";
export const CC_FINDFACE_USER = process.env.CC_FINDFACE_USER || "services_node";
export const CC_FINDFACE_PASSWORD = process.env.CC_FINDFACE_PASSWORD || "node9000";

export const CC_FINDFACE_EVENT_TOKEN = process.env.CC_FINDFACE_EVENT_TOKEN || "15ca64cd61e14022b7c6eecc8cfc4b63";
export const CC_FINDFACE_EVENT_CAMERA = process.env.CC_FINDFACE_EVENT_CAMERA || "2";
export const CC_FINDFACE_WATCHLIST = parseInt(process.env.CC_FINDFACE_WATCHLIST) || 2;

export const CC_ENABLE_TERMINATE_SESSIONS = !!process.env.CC_ENABLE_TERMINATE_SESSIONS || false;
