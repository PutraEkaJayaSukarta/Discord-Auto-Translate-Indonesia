
# Discord Auto Translate Indonesia 🇮🇩 ↔ 🇬🇧
A Vencord plugin that automatically translates Discord messages between Indonesian and English.
The plugin supports:
- 🇮🇩 Indonesian → 🇬🇧 English for outgoing messages
- 🇬🇧 English → 🇮🇩 Indonesian for incoming messages
- 🔄 Quick translator ON/OFF toggle
- ⌨️ `Ctrl + Shift + T` shortcut
- 🟢 `Translator: ON` / 🔴 `Translator: OFF` indicator
- Works together with the original Key-Intercept features
> ⚠️ **Disclaimer:** This project modifies the Discord client through Vencord. Modified Discord clients may have compatibility and Terms of Service risks. Use this project at your own discretion.
---
## ✨ Features
### Outgoing Translation
Type Indonesian normally:
```text
Aku mau ikut bermain nanti.
````
The message sent to Discord becomes:
```text
I want to join the game later.
```
Your friends receive the English version.
---
### Incoming Translation
When another user sends an English message:
```text
Are you coming later?
```
The plugin displays an Indonesian translation underneath:
```text
🇮🇩 Apakah kamu akan datang nanti?
```
The original message is still visible.
---
## ⌨️ Toggle Translator
The translator can be enabled or disabled at any time.
### Shortcut
```text
Ctrl + Shift + T
```
Press the shortcut to switch between:
```text
🟢 Translator: ON
```
and
```text
🔴 Translator: OFF
```
### Translator ON
```text
Kamu mengetik:
Aku sudah siap.
↓
Discord mengirim:
I'm ready.
```
### Translator OFF
```text
Kamu mengetik:
Aku sudah siap.
↓
Discord mengirim:
Aku sudah siap.
```
The toggle does **not** disable the other Key-Intercept features.
---
# 📦 Installation
## Requirements
Before installing, make sure you have:
* Windows 10/11
* Node.js 18 or newer
* Git
* pnpm
* Vencord
* Internet connection
Node.js 20+ is recommended.
---
# 1. Download the Project
Download this repository from GitHub:
```
Code → Download ZIP
```
Extract the ZIP somewhere convenient.
For example:
```
D:\Discord-Auto-Translate-Indonesia\
```
The folder should contain:
```
Discord-Auto-Translate-Indonesia/
├── key-intercept/
├── translator-server.js
├── start-translator.bat
├── package.json
├── README.md
└── LICENSE
```
---
# 2. Install Vencord
If you already have Vencord installed, skip this step.
Clone Vencord:
```
git clone https://github.com/Vendicated/Vencord.git
```
Then enter the folder:
```powershell
cd Vencord
```
Install dependencies:
```powershell
pnpm install
```
---
# 3. Install the Key-Intercept Plugin
Copy the following folder:
```
key-intercept
```
into:
```
Vencord/src/userplugins/
```
The final structure should look like:
```text
Vencord/
└── src/
    └── userplugins/
        └── key-intercept/
            ├── index.ts
            ├── core.ts
            ├── translator.ts
            ├── vencord.ts
            ├── types.ts
            └── ...
```
---
# 4. Start the Translation Server
The plugin uses a small local translation server.
Go back to the project folder:
```
cd D:\Discord-Auto-Translate-Indonesia
```
Then run:
```text
start-translator.bat
```
A command window should appear.
You should see:
```text
Discord Translator listening on http://127.0.0.1:32123
```
Keep this window running while using the translator.
### Test the server
Open this address in your browser:
```
http://127.0.0.1:32123/health
```
You should see:
```json
{
  "ok": true
}
```
If you see this, the translator server is running correctly.
---
# 5. Build Vencord
Go to your Vencord directory:
```powershell
cd %USERPROFILE%\Vencord
```
Build Vencord:
```powershell
pnpm build
```
After the build completes:
```powershell
pnpm inject
```
Restart Discord after the injection is complete.
---
# 6. Enable Key-Intercept
Open Discord settings:
```text
Settings
   ↓
Vencord
   ↓
Plugins
   ↓
Key Intercept
```
Enable:
```text
Key Intercept
```
Restart Discord if necessary.
---
# 🚀 How to Use
## Outgoing Messages
Make sure the translation server is running:
```
start-translator.bat
```
Then open Discord.
Make sure the indicator says:
```
🟢 Translator: ON
```
Now type Indonesian normally.
Example:
```text
Aku akan datang sekitar jam 8.
```
Press Enter.
The message sent to Discord should be translated into English:
```
I'll arrive around 8 PM.
```
---
# 💬 Incoming Messages
When someone sends an English message:
```text
Are you ready to play?
```
The plugin attempts to display:
```text
🇮🇩 Apakah kamu siap bermain?
```
under the original message.
The original English message is not replaced.
---
# 🔴 Disable Translation
Press:
```
Ctrl + Shift + T
```
The indicator changes to:
```text
🔴 Translator: OFF
```
Outgoing messages will now be sent normally.
Example:
```
Aku mau makan dulu.
```
will remain:
```text
Aku mau makan dulu.
```
---
# 🟢 Enable Translation Again
Press:
```
Ctrl + Shift + T
```
again.
The indicator changes back to:
```
🟢 Translator: ON
```
Translation is active again.
---
# 🛑 Stop the Translator Server
When you are finished using the translator:
1. Go to the translator command window.
2. Press:
```
Ctrl + C
```
The local translation server will stop.
You can also simply close the command window.
---
# 🔧 Troubleshooting
## Translator does nothing
Make sure the translator server is running.
Run:
```
start-translator.bat
```
Then check:
```
http://127.0.0.1:32123/health
```
You should receive:
```json
{"ok":true}
```
---
## Messages are still sent in Indonesian
Check the indicator:
```
Translator: ON
```
If it says:
```
Translator: OFF
```
press:
```
Ctrl + Shift + T
```
---
## `Ctrl + Shift + T` does nothing
Make sure the **Key-Intercept** plugin is enabled in:
```
Discord
→ Settings
→ Vencord
→ Plugins
→ Key-Intercept
```
Then restart Discord.
---
## Translation server cannot start
Check your Node.js version:
```powershell
node --version
```
Node.js 18 or newer is required.
Recommended:
```
Node.js 20+
```
---
## Port 32123 is already in use
The translation server uses:
```
127.0.0.1:32123
```
If another program is already using that port, the server cannot start.
Close the other program or change the port in:
```
translator-server.js
```
and:
```
key-intercept/translator.ts
```
Both ports must match.
---
# 🔒 Privacy
The translator runs through a local server:
```text
Discord
   ↓
Vencord
   ↓
127.0.0.1:32123
   ↓
Translation service
```
The local server does not require a Discord token.
However, text that needs translation is sent to the translation service.
**Do not use this project for highly sensitive or confidential conversations if you are not comfortable sending that text to an external translation service.**
---
# 🧩 Project Structure
```text
Discord-Auto-Translate-Indonesia/
│
├── key-intercept/
│   ├── index.ts
│   ├── core.ts
│   ├── translator.ts
│   ├── vencord.ts
│   ├── types.ts
│   └── ...
│
├── translator-server.js
├── start-translator.bat
├── package.json
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```
---
# 🛠️ How It Works
### Outgoing
```
You type Indonesian
        ↓
Key-Intercept
        ↓
Local Translator
        ↓
Indonesian → English
        ↓
Discord
```
### Incoming
```
Discord message
        ↓
Key-Intercept
        ↓
Local Translator
        ↓
English → Indonesian
        ↓
Translation displayed
```
---
# 🙏 Credits
This project is based on:
**Key-Intercept**
Original repository:
[https://github.com/Key-Intercept/key-intercept](https://github.com/Key-Intercept/key-intercept)
Vencord:
[https://github.com/Vendicated/Vencord](https://github.com/Vendicated/Vencord)
---
# ⚠️ Disclaimer
This project is an unofficial community modification.
It is not affiliated with, endorsed by, or sponsored by Discord, Vencord, or Google.
Use modified Discord clients at your own risk.



