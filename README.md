# Discord Auto Translate Indonesia 🇮🇩 ↔ 🇬🇧

Vencord plugin untuk menerjemahkan pesan Discord secara otomatis antara Bahasa Indonesia dan Bahasa Inggris.

## ✨ Fitur

* 🇮🇩 Indonesia → 🇬🇧 English untuk pesan keluar
* 🇬🇧 English → 🇮🇩 Indonesia untuk pesan masuk
* 🔄 Toggle translator ON/OFF
* ⌨️ `Ctrl + Shift + T` untuk mengaktifkan/nonaktifkan translator
* 🟢 `Translator: ON` / 🔴 `Translator: OFF`
* 🔧 Tetap bekerja dengan fitur Key-Intercept lainnya

### Contoh

**Pesan keluar:**

```text
Aku mau ikut bermain nanti.
```

Menjadi:

```text
I want to join the game later.
```

**Pesan masuk:**

```text
Are you coming later?
```

Ditampilkan juga sebagai:

```text
🇮🇩 Apakah kamu akan datang nanti?
```

Pesan asli tetap ditampilkan.

---

# 📦 Instalasi

## Requirements

* Windows 10/11
* Node.js 18+
* Git
* pnpm
* Vencord
* Internet

Node.js 20+ direkomendasikan.

## 1. Download Repository

Download repository ini dari GitHub, lalu extract.

Contoh:

```text
D:\Discord-Auto-Translate-Indonesia\
```

Strukturnya:

```text
Discord-Auto-Translate-Indonesia/
├── key-intercept/
├── translator-server.js
├── start-translator.bat
├── package.json
└── README.md
```

## 2. Install Vencord

Jika Vencord sudah terpasang, lewati langkah ini.

```powershell
git clone https://github.com/Vendicated/Vencord.git
cd Vencord
pnpm install
```

## 3. Install Plugin

Copy folder:

```text
key-intercept
```

ke:

```text
Vencord/src/userplugins/
```

Hasilnya:

```text
Vencord/
└── src/
    └── userplugins/
        └── key-intercept/
            ├── index.ts
            ├── core.ts
            ├── translator.ts
            └── ...
```

## 4. Jalankan Translation Server

Masuk ke folder project:

```powershell
cd D:\Discord-Auto-Translate-Indonesia
```

Jalankan:

```text
start-translator.bat
```

Jika berhasil, akan muncul:

```text
Discord Translator listening on http://127.0.0.1:32123
```

Cek server melalui browser:

```text
http://127.0.0.1:32123/health
```

Jika muncul:

```json
{"ok":true}
```

berarti server sudah berjalan.

**Biarkan window server tetap terbuka saat menggunakan translator.**

## 5. Build Vencord

```powershell
cd %USERPROFILE%\Vencord
pnpm build
pnpm inject
```

Setelah selesai, restart Discord.

## 6. Aktifkan Plugin

Di Discord:

```text
Settings
→ Vencord
→ Plugins
→ Key Intercept
```

Aktifkan **Key Intercept**.

---

# 🚀 Cara Menggunakan

## Translator ON

Pastikan indikator menunjukkan:

```text
🟢 Translator: ON
```

Ketik Bahasa Indonesia seperti biasa:

```text
Aku akan datang sekitar jam 8.
```

Discord akan mengirim versi Inggris:

```text
I'll arrive around 8 PM.
```

## Translator OFF

Tekan:

```text
Ctrl + Shift + T
```

Indikator berubah menjadi:

```text
🔴 Translator: OFF
```

Pesan akan dikirim tanpa diterjemahkan.

Tekan `Ctrl + Shift + T` lagi untuk mengaktifkannya kembali.

---

# 🔧 Troubleshooting

### Translator tidak bekerja

Pastikan server berjalan:

```text
start-translator.bat
```

Kemudian buka:

```text
http://127.0.0.1:32123/health
```

Harus muncul:

```json
{"ok":true}
```

### Shortcut tidak bekerja

Pastikan **Key Intercept** sudah aktif:

```text
Discord
→ Settings
→ Vencord
→ Plugins
→ Key Intercept
```

Kemudian restart Discord.

### Port 32123 sudah digunakan

Port default:

```text
127.0.0.1:32123
```

Jika port tersebut digunakan program lain, ubah port di:

```text
translator-server.js
```

dan:

```text
key-intercept/translator.ts
```

Pastikan kedua port sama.

### Cek versi Node.js

```powershell
node --version
```

Gunakan Node.js 18 atau lebih baru.

---

# 🔒 Privacy

Translator berjalan melalui server lokal:

```text
Discord
   ↓
Vencord
   ↓
127.0.0.1:32123
   ↓
Translation Service
```

Server lokal tidak membutuhkan Discord token.

Namun, teks yang diterjemahkan dapat dikirim ke **translation service** yang digunakan project.

Jangan gunakan untuk percakapan sensitif jika tidak nyaman mengirimkan teks tersebut ke layanan eksternal.

---

# 🛑 Menghentikan Translator

Jika sudah selesai, buka window translation server lalu tekan:

```text
Ctrl + C
```

atau tutup window tersebut.

---

# 🧩 Project Structure

```text
Discord-Auto-Translate-Indonesia/
├── key-intercept/
│   ├── index.ts
│   ├── core.ts
│   ├── translator.ts
│   ├── vencord.ts
│   └── ...
├── translator-server.js
├── start-translator.bat
├── package.json
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```

---

# 🙏 Credits

Based on:

* Key-Intercept
* Vencord

This is an unofficial community project and is not affiliated with Discord, Vencord, or Google.

> ⚠️ Modified Discord clients may have compatibility or Terms of Service risks. Use this project at your own discretion.
