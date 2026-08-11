/*
 * Discord Auto Translator for Key-Intercept
 *
 * Uses a small localhost translation service so the outgoing hook can stay
 * synchronous. The local service does the actual network request.
 */

export const TRANSLATOR_URL = "http://127.0.0.1:32123/translate";
export const SOURCE_LANGUAGE = "id";
export const TARGET_LANGUAGE = "en";

function shouldSkip(text: string): boolean {
    const trimmed = text.trim();
    if (!trimmed) return true;
    if (/^https?:\/\//i.test(trimmed) && !/\s/.test(trimmed)) return true;
    if (/^<@!?\d+>$/.test(trimmed)) return true;
    return false;
}

/**
 * Deliberately synchronous: onBeforeMessageSend is synchronous, so an async
 * request would arrive after Discord has already sent the original message.
 */
export function translateOutgoingSync(text: string): string {
    if (shouldSkip(text)) return text;

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", TRANSLATOR_URL, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            text,
            source: SOURCE_LANGUAGE,
            target: TARGET_LANGUAGE,
        }));

        if (xhr.status !== 200) {
            console.warn("[Discord Translator] Local server returned", xhr.status);
            return text;
        }

        const result = JSON.parse(xhr.responseText);
        return typeof result.text === "string" && result.text.trim()
            ? result.text
            : text;
    } catch (error) {
        console.warn("[Discord Translator] Outgoing translation failed:", error);
        return text;
    }
}

export async function translateIncoming(text: string): Promise<string | null> {
    if (shouldSkip(text)) return null;

    try {
        const response = await fetch(TRANSLATOR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                source: "en",
                target: "id",
            }),
        });

        if (!response.ok) return null;
        const result = await response.json();
        return typeof result.text === "string" && result.text.trim()
            ? result.text
            : null;
    } catch (error) {
        console.warn("[Discord Translator] Incoming translation failed:", error);
        return null;
    }
}
