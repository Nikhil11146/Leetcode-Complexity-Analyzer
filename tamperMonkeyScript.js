// ==UserScript==
// @name         Leetcode Complexity Analyzer
// @namespace    http://tampermonkey.net/
// @version      2026-05-31
// @description  Analyze LeetCode solution complexity using Gemini
// @author       You
// @match        https://leetcode.com/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/580597/Leetcode%20Complexity%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/580597/Leetcode%20Complexity%20Analyzer.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function createDialog(time, space, message) {
        // Overlay
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";

        // Modal
        const modal = document.createElement("div");
        modal.className = "modal";

        modal.innerHTML = `
        <div class="modal-header">
            <h2>Leetcode Complexity Analyzer</h2>
        </div>
        <div class="modal-body">
            <p>Time Complexity: ${time}</p>
            <p>Space Complexity: ${space}</p>
            <p>${message}</p>
        </div>
        <div class="modal-footer">
            <button class="close-btn">Close</button>
        </div>
    `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.querySelector(".close-btn").addEventListener("click", () => {
            overlay.remove();
        });

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    function createButton() {
        const button = document.createElement('button');

        button.id = 'complexity-btn';
        button.textContent = 'Complexity';

        button.style.padding = '0px 10px';
        button.style.marginLeft = '8px';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '600';
        button.style.backgroundColor = '#222222';
        button.style.color = '#26AA3E';
        button.style.fontSize = '14px';

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#2F2F2F';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#222222';
        });

        return button;
    }

    function addButton() {
        const toolbar = document.getElementById('ide-top-btns');

        if (!toolbar) return false;

        if (document.getElementById('complexity-btn')) return true;

        const customButton = createButton();

        customButton.addEventListener('click', analyzeComplexity);

        toolbar.appendChild(customButton);

        return true;
    }

    function getCode() {
        try {
            const monacoCode =
                window.monaco?.editor?.getModels?.()[0]?.getValue();

            if (monacoCode?.trim()) {
                return monacoCode;
            }

            const viewLines =
                document.querySelector('.view-lines')?.innerText;

            if (viewLines?.trim()) {
                return viewLines;
            }

            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function analyzeComplexity() {
        try {
            const button = document.getElementById('complexity-btn');

            button.disabled = true;
            button.textContent = 'Analyzing...';

            const code = getCode();

            if (!code) {
                throw new Error('Could not extract code from editor.');
            }

            const response = await fetch('https://leetcode-complexity-analyzer.onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            const result = await response.json();

            alert(
                `Time Complexity: ${result.timeComplexity}\n\n` +
                `Space Complexity: ${result.spaceComplexity}\n\n` +
                `Explanation: ${result.explanation}`
            );
        } catch (error) {
            console.error(error);
            alert(`Error:\n\n${error.message}`);
        } finally {
            const button = document.getElementById('complexity-btn');

            if (button) {
                button.disabled = false;
                button.textContent = 'Complexity';
            }
        }
    }

    const observer = new MutationObserver(() => {
        addButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addButton();
})();