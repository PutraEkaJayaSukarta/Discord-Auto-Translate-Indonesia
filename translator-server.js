const http = require("http");
const { URL } = require("url");

const HOST = "127.0.0.1";
const PORT = 32123;

async function translate(text, source, target) {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", source || "auto");
    url.searchParams.set("tl", target);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status}`);
    const data = await response.json();
    const translated = Array.isArray(data?.[0])
        ? data[0].map(part => part?.[0] || "").join("")
        : "";
    if (!translated) throw new Error("Empty translation result");
    return translated;
}

function send(res, status, body) {
    const json = JSON.stringify(body);
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(json);
}

const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
        });
        return res.end();
    }

    if (req.method === "GET" && req.url === "/health") {
        return send(res, 200, { ok: true });
    }

    if (req.method !== "POST" || req.url !== "/translate") {
        return send(res, 404, { error: "Not found" });
    }

    let body = "";
    req.on("data", chunk => {
        body += chunk;
        if (body.length > 20000) req.destroy();
    });

    req.on("end", async () => {
        try {
            const input = JSON.parse(body || "{}");
            if (typeof input.text !== "string" || !input.text.trim()) {
                return send(res, 400, { error: "text is required" });
            }

            const text = await translate(input.text, input.source || "auto", input.target || "en");
            send(res, 200, { text });
        } catch (error) {
            console.error("[translator-server]", error);
            send(res, 502, { error: String(error?.message || error) });
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Discord Translator listening on http://${HOST}:${PORT}`);
});
