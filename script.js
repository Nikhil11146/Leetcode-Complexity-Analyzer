// ==UserScript==
// @name         Complexity
// @namespace    http://tampermonkey.net/
// @version      2026-05-31
// @description  Analyze LeetCode solution complexity using Gemini
// @author       You
// @match        https://leetcode.com/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// ==/UserScript==


(function () {
        'use strict';

        const API_KEY = 'AIzaSyD8L8kL0Z2jRMKA2hndd9oTERX3ikKDzEw';

        function createButton() {
            const button = document.createElement('button');

            button.id = 'complexity-btn';
            button.textContent = 'Complexity';

            button.style.padding = '0px 10px';
            button.style.marginLeft = '8px';
            button.style.border = 'none';
            button.style.borderRadius = '8px';
            button.style.cursor = 'pointer';
            button.style.fontWeight = '600';
            button.style.backgroundColor = '#222222';
            button.style.color = '#2563eb';
            button.style.fontSize = '14px';

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

                const prompt = `
Analyze this code.

Return ONLY valid JSON.

{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "explanation": "short explanation"
}

Code:

${code}
`;

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [
                                {
                                    parts: [
                                        {
                                            text: prompt
                                        }
                                    ]
                                }
                            ]
                        })
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();

                console.log('Gemini Response:', data);

                const text =
                    data?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!text) {
                    throw new Error('Gemini returned an empty response.');
                }

                const match = text.match(/\{[\s\S]*\}/);

                if (!match) {
                    throw new Error('Could not find JSON in Gemini response.');
                }

                const result = JSON.parse(match[0]);

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