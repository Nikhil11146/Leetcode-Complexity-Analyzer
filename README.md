# 🚀 LeetCode Complexity Analyzer

Analyze the **Time Complexity** and **Space Complexity** of your LeetCode solutions instantly using AI.

No more staring at nested loops wondering whether your solution is `O(n log n)` or secretly plotting an `O(n²)` disaster. 🧠⚡

This project injects a **Complexity** button directly into the LeetCode editor and uses **Google Gemini AI** to analyze your code and explain its complexity in plain English.

---

## 📸 Preview

When solving a problem on LeetCode:

```text
Run | Submit | Complexity
```

Click the **Complexity** button and get:

```text
Time Complexity: O(n)

Space Complexity: O(1)

Explanation:
The array is traversed once and only constant extra memory is used.
```

---

# ✨ Features

✅ Instant Time Complexity Analysis

✅ Instant Space Complexity Analysis

✅ AI Generated Explanation

✅ Works Directly Inside LeetCode

✅ Lightweight and Fast

✅ Available as:

* Tampermonkey Script
* Chrome Extension

---

# 🧠 How It Works

The project follows this flow:

```text
LeetCode Editor
       ↓
Extract User Code
       ↓
Send Code To Backend
       ↓
Gemini AI Analysis
       ↓
Return JSON Response
       ↓
Display Complexity Result
```

Example Request:

```json
{
  "code": "your solution code"
}
```

Example Response:

```json
{
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "explanation": "Single traversal with constant extra memory."
}
```

---

# 🛠️ Tech Stack

## Frontend

* JavaScript
* DOM Manipulation
* MutationObserver

## Backend

* Node.js
* Express.js

## AI

* Google Gemini API

## Deployment

* Render

---

# 📂 Project Structure

```text
project
│
├── extension/
│   ├── manifest.json
│   ├── content.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   └── controllers/
│
└── README.md
```

---

# 🔥 Installation (Tampermonkey)

## Direct Script Installation

https://greasyfork.org/en/scripts/580597-leetcode-complexity-analyzer

## Manual Installation

## Step 1

Install Tampermonkey:

https://www.tampermonkey.net/

---

## Step 2

Open Tampermonkey Dashboard.

```text
Create New Script
```

---

## Step 3

Delete the default template.

Paste the userscript from this repository.

Save the script.

---

## Step 4

Visit any LeetCode problem.

Example:

https://leetcode.com/problems/two-sum/

You should now see:

```text
Complexity
```

beside the Run / Submit buttons.

---

## Step 5

Click the button to analyze your solution.

🎉 Done!

---

# 🧩 Installation (Chrome Extension)

## Step 1

Clone the repository.

```bash
git clone https://github.com/Nikhil11146/Leetcode-Complexity-Analyzer.git
```

---

## Step 2

Open Chrome.

Navigate to:

```text
chrome://extensions
```

---

## Step 3

Enable:

```text
Developer Mode
```

(top-right corner)

---

## Step 4

Click:

```text
Load unpacked
```

---

## Step 5

Select the extension folder.

```text
Leetcode-Complexity-Analyzer/extension
```

---

## Step 6

The extension should now appear in Chrome.

Refresh LeetCode.

You will see:

```text
Complexity
```

inside the editor toolbar.

🎉 Extension installed successfully.

---

# ⚙️ Backend Setup

## Clone Repository

```bash
git clone https://github.com/Nikhil11146/Leetcode-Complexity-Analyzer.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Environment Variables

Create:

```env
.env
```

Add:

```env
GEMINI_API_KEY=YOUR_API_KEY
PORT=5000
```

---

## Start Server

```bash
npm start
```

or

```bash
node server.js
```

Server runs on:

```text
http://localhost:5000
```

---

# 🌍 Deploy Backend

You can deploy the backend on:

* Render
* Railway
* VPS
* Fly.io

Example:

```text
Chrome Extension
        ↓
Render Backend
        ↓
Gemini API
```

This keeps your API key secure and prevents it from being exposed in the browser.

---

# 🔒 Security

Never expose:

```js
const API_KEY = "YOUR_KEY";
```

inside:

* Browser Extensions
* React Apps
* Userscripts
* Frontend Code

Always store API keys on the backend.

---

# 🚧 Future Improvements

* Better UI Modal
* Syntax Highlighting
* Optimization Suggestions
* Multiple AI Models
* Code Smell Detection
* Codeforces Support
* NeetCode Support
* Submission History Analysis
* One-Click Code Optimization

---

# 🤝 Contributing

Contributions are welcome.

Feel free to:

* Open Issues
* Suggest Features
* Submit Pull Requests

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the project

🧠 Build cool stuff with it

---

Built with ☕, JavaScript, and an unhealthy amount of LeetCode tabs.
