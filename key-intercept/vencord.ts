/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

declare const Vencord: any;

import { editPreviousMessage, getPreviousMessage, getPreviousMessageSender } from "./getPreviousMessage";
import {
    applyDrone as applyDroneCore,
    applyReplacements as applyReplacementsCore,
    config,
    droneConfig,
    getData,
    DroneContext,
    whitelist,
} from "./core";
import { translateIncoming, translateOutgoingSync } from "./translator";

let translatorEnabled = true;
const TRANSLATOR_INCOMING = true;
const INCOMING_DEBOUNCE_MS = 350;
const TOGGLE_KEY = "t";
const TOGGLE_CTRL = true;
const TOGGLE_SHIFT = true;

function setTranslatorIndicator(enabled: boolean) {
    if (typeof document === "undefined") return;
    let indicator = document.getElementById("key-intercept-translator-indicator") as HTMLDivElement | null;
    if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = "key-intercept-translator-indicator";
        Object.assign(indicator.style, {
            position: "fixed",
            right: "18px",
            bottom: "18px",
            zIndex: "999999",
            padding: "6px 10px",
            borderRadius: "6px",
            background: "var(--background-floating, #111214)",
            color: "var(--text-normal, #fff)",
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "var(--font-primary, sans-serif)",
            boxShadow: "0 2px 8px rgba(0,0,0,.35)",
            pointerEvents: "none",
            transition: "opacity .2s ease"
        });
        document.body.appendChild(indicator);
    }
    indicator.textContent = `Translator: ${enabled ? "ON" : "OFF"}`;
    indicator.style.border = `1px solid ${enabled ? "#23a55a" : "#f23f42"}`;
    indicator.style.color = enabled ? "#57f287" : "#ed4245";
}

function showToggleNotice(enabled: boolean) {
    setTranslatorIndicator(enabled);
    const indicator = document.getElementById("key-intercept-translator-indicator") as HTMLElement | null;
    if (!indicator) return;
    indicator.style.opacity = "1";
    window.setTimeout(() => {
        if (indicator) indicator.style.opacity = "0.72";
    }, 1200);
}

function installTranslatorShortcut() {
    if (typeof window === "undefined") return () => { };

    const handler = (event: KeyboardEvent) => {
        if (event.ctrlKey !== TOGGLE_CTRL || event.shiftKey !== TOGGLE_SHIFT || event.altKey || event.metaKey) return;
        if (event.key.toLowerCase() !== TOGGLE_KEY) return;

        event.preventDefault();
        event.stopPropagation();
        translatorEnabled = !translatorEnabled;
        if (!translatorEnabled) {
            document.querySelectorAll("[data-translated-by-key-intercept]").forEach(el => el.remove());
        } else {
            document.querySelectorAll<HTMLElement>('[class*="messageContent"], [class*="markup"]').forEach(node => {
                // Re-translation is handled by the normal observer after a short delay.
                node.dispatchEvent(new Event("key-intercept-translation-toggle"));
            });
        }
        showToggleNotice(translatorEnabled);
        console.log(`[Discord Translator] ${translatorEnabled ? "ON" : "OFF"}`);
    };

    window.addEventListener("keydown", handler, true);
    setTranslatorIndicator(translatorEnabled);

    return () => {
        window.removeEventListener("keydown", handler, true);
        document.getElementById("key-intercept-translator-indicator")?.remove();
    };
}

export function applyDrone(msg: string, drone_end: Date, speech_header: string, speech_footer: string, action_header: string, action_footer: string, whisper_header: string, whisper_footer: string, loud_header: string, loud_footer: string, drone_term: string, drone_health: number, channelID: string, verbose: boolean = true) {
    const currentUser = Vencord.Webpack.findByProps("getCurrentUser", "getUser").getCurrentUser();
    const previousMessage = getPreviousMessage(channelID);
    const previousSender = getPreviousMessageSender(channelID);
    const result = applyDroneCore(msg, drone_end, speech_header, speech_footer, action_header, action_footer, whisper_header, whisper_footer, loud_header, loud_footer, drone_term, drone_health, channelID, {
        previousMessage,
        previousSenderId: previousSender?.id ?? null,
        currentUserId: currentUser.id,
    }, verbose);

    if (result.editPreviousMessage) {
        editPreviousMessage(result.editPreviousMessage.channelId, result.editPreviousMessage.messageId, result.editPreviousMessage.newContent);
    }

    return result.message;
}

export function applyReplacements(msg: string, channelId: string): string {
    const currentUser = Vencord.Webpack.findByProps("getCurrentUser", "getUser").getCurrentUser();
    const previousMessage = getPreviousMessage(channelId);
    const previousSender = getPreviousMessageSender(channelId);
    const result = applyReplacementsCore(msg, channelId, {
        previousMessage,
        previousSenderId: previousSender?.id ?? null,
        currentUserId: currentUser.id,
    });

    if (result.editPreviousMessage) {
        editPreviousMessage(result.editPreviousMessage.channelId, result.editPreviousMessage.messageId, result.editPreviousMessage.newContent);
    }

    return result.message;
}

function installIncomingTranslator(pluginName: string) {
    if (!TRANSLATOR_INCOMING || typeof document === "undefined") return () => { };

    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    const seen = new WeakSet<Element>();

    const translateVisibleMessages = () => {
        if (stopped || !translatorEnabled) return;

        const nodes = Array.from(document.querySelectorAll<HTMLElement>(
            '[class*="messageContent"], [class*="markup"]'
        ));

        for (const node of nodes) {
            if (seen.has(node)) continue;
            if (node.closest("[data-translated-by-key-intercept]")) continue;

            const text = node.innerText?.trim();
            if (!text || text.length < 2 || text.length > 1000) continue;

            seen.add(node);
            const marker = document.createElement("div");
            marker.dataset.translatedByKeyIntercept = "true";
            marker.style.marginTop = "2px";
            marker.style.paddingLeft = "8px";
            marker.style.borderLeft = "2px solid var(--brand-500)";
            marker.style.opacity = "0.78";
            marker.style.fontSize = "0.9em";
            marker.textContent = "Translating…";
            node.appendChild(marker);

            translateIncoming(text).then(translated => {
                if (!translated || stopped) {
                    marker.remove();
                    return;
                }
                marker.textContent = `🇮🇩 ${translated}`;
            }).catch(() => marker.remove());
        }
    };

    const observer = new MutationObserver(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(translateVisibleMessages, INCOMING_DEBOUNCE_MS);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    translateVisibleMessages();

    return () => {
        stopped = true;
        if (timer) clearTimeout(timer);
        observer.disconnect();
        document.querySelectorAll('[data-translated-by-key-intercept]').forEach(el => el.remove());
    };
}

export default definePlugin({
    _filterBypassUsers: new Set<string>(),
    name: "key-intercept",
    description: "You don't need to control what you say, let someone else control it. Includes optional ID ↔ EN translation.",
    authors: [{ name: "Tom", id: 277137325342064640n }],
    dependencies: ["MessageEventsAPI"],
    _handler: null as ((event: any) => void) | null,
    _stopIncomingTranslator: null as (() => void) | null,
    _stopTranslatorShortcut: null as (() => void) | null,

    async start() {
        const UserStore = Vencord.Webpack.findByProps("getCurrentUser", "getUser");
        const currentUser = UserStore.getCurrentUser();
        await getData(currentUser.id, currentUser.username);
        this._stopIncomingTranslator = installIncomingTranslator(this.name);
        this._stopTranslatorShortcut = installTranslatorShortcut();
    },

    stop() {
        this._stopIncomingTranslator?.();
        this._stopIncomingTranslator = null;
        this._stopTranslatorShortcut?.();
        this._stopTranslatorShortcut = null;
    },

    onBeforeMessageSend(channelId: string, msg: { content: string }) {
        const ChannelStore = Vencord.Webpack.findByProps("getChannel", "getDMFromUserId");
        const GuildStore = Vencord.Webpack.findByProps("getGuild", "getGuilds");
        const UserStore = Vencord.Webpack.findByProps("getCurrentUser", "getUser");

        const channel = ChannelStore?.getChannel?.(channelId);
        if (!channel) return;
        if (config?.debug) console.log("Channel object:", channel);

        let nameToCheck: string | null = null;
        let idToCheck: string | null = null;

        if (channel.guild_id) {
            const guild = GuildStore?.getGuild(channel.guild_id);
            if (config?.debug) console.log("Guild object:", guild);
            nameToCheck = guild?.name ?? null;
            idToCheck = guild?.id ?? null;
        } else {
            if (channel.name) {
                nameToCheck = channel.name;
            } else if (channel.recipients?.length > 0) {
                const currentUser = UserStore.getCurrentUser();
                const recipientNames = channel.recipients
                    .filter((id: string) => id !== currentUser.id)
                    .map((id: string) => UserStore.getUser(id)?.username)
                    .filter(Boolean);
                nameToCheck = recipientNames.join(", ");
                idToCheck = channel.id ?? null;
            }
        }

        if (config?.debug) console.log(`Name to check against whitelist: "${nameToCheck}"`);
        if (config?.debug) console.log(`ID to check against whitelist: "${idToCheck}"`);

        if (whitelist.length > 0) {
            const nameMatches = !!nameToCheck && whitelist.some(item => item.server_name === nameToCheck);
            const idMatches = !!idToCheck && whitelist.some(item => item.discord_id === idToCheck);
            if ((nameToCheck || idToCheck) && !nameMatches && !idMatches) return;
        }

        const channelName = channel?.name?.toLowerCase?.() ?? "";
        if (channelName.includes("sfw") && !channelName.includes("nsfw")) return;

        let output = applyReplacements(msg.content, channelId);

        if (translatorEnabled && output.trim()) {
            const translated = translateOutgoingSync(output);
            if (translated !== output) {
                console.log("[Discord Translator] ID → EN:", output, "→", translated);
                output = translated;
            }
        }

        msg.content = output;
    },
});
