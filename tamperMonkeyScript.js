// ==UserScript==
// @name         Leetcode Addons
// @namespace    http://tampermonkey.net/
// @version      2026-06-02
// @description  try to take over the world!
// @author       You
// @match        https://leetcode.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // COMPLEXITY BUTTON
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

            createDialog(result.timeComplexity, result.spaceComplexity, result.explanation);

            // alert(
            //     `Time Complexity: ${result.timeComplexity}\n\n` +
            //     `Space Complexity: ${result.spaceComplexity}\n\n` +
            //     `Explanation: ${result.explanation}`
            // );
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

    const style = document.createElement("style");
    style.textContent = `
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    color: white;
}

.modal {
color: white;
    background: #222222;
    width: 400px;
    max-width: 90%;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    animation: fadeIn 0.2s ease;
}

.modal-header h2 {
    margin: 0 0 10px;
    color: white;
}

.modal-body {
    margin-bottom: 20px;
    color: white;
}

.modal-body p {
    margin: 10px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
}

.close-btn {
    padding: 8px 16px;
    border: none;
    background: #2563eb;
    color: white;
    border-radius: 6px;
    cursor: pointer;
}

.close-btn:hover {
    background: #1d4ed8;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
`;
    document.head.appendChild(style);

    addButton();

















    // QUES PER DAY

    let activeDaysCache = null;

    async function getLifetimeActiveDays() {
        if (activeDaysCache !== null) {
            return activeDaysCache;
        }

        const username = location.pathname.split('/')[2];

        async function fetchYear(year) {
            const res = await fetch('https://leetcode.com/graphql/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    operationName: 'userProfileCalendar',
                    variables: {
                        username,
                        year
                    },
                    query: `
                query userProfileCalendar($username: String!, $year: Int) {
                  matchedUser(username: $username) {
                    userCalendar(year: $year) {
                      activeYears
                      submissionCalendar
                    }
                  }
                }
                `
                })
            });

            return res.json();
        }

        const currentYear = new Date().getFullYear();

        const first = await fetchYear(currentYear);

        const years =
            first.data.matchedUser.userCalendar.activeYears || [];

        const activeDays = new Set();

        const responses = await Promise.all(
            years.map(year => fetchYear(year))
        );

        for (const data of responses) {
            const calendar = JSON.parse(
                data.data.matchedUser.userCalendar.submissionCalendar || "{}"
            );

            Object.keys(calendar).forEach(day => {
                activeDays.add(day);
            });
        }

        activeDaysCache = activeDays.size;

        return activeDaysCache;
    }

    function createD(ques, days) {
        const d = document.createElement('div');

        d.id = 'questions-per-day';
        d.className = 'mr-4.5 space-x-1';

        d.innerHTML = `
        <span class="text-label-3 dark:text-dark-label-3">
            Avg Solves/Day:
        </span>
        <span class="font-medium text-label-2 dark:text-dark-label-2">
            ${days > 0 ? (ques / days).toFixed(2) : '0.00'}
        </span>
    `;

        return d;
    }

    let qpdRendering = false;

    async function addD() {
        if (!location.pathname.startsWith('/u/')) {
            return false;
        }

        if (document.getElementById('questions-per-day')) {
            return true;
        }

        if(qpdRendering) return false;

        qpdRendering = true;

        try {
            const activeDaysLabel = [...document.querySelectorAll('span')]
                .find(el => el.textContent.includes('Total active days'));

            if (!activeDaysLabel) {
                return false;
            }

            const statsBar =
                activeDaysLabel.closest('div.flex.items-center.text-xs') ||
                activeDaysLabel.parentElement?.parentElement;

            if (!statsBar) {
                return false;
            }

            const solvedElement = [...document.querySelectorAll('span')]
                .find(el =>
                    /^\d+$/.test(el.textContent.trim()) &&
                    el.parentElement?.textContent.includes('/')
                );

            if (!solvedElement) {
                return false;
            }

            const solved = parseInt(
                solvedElement.textContent.trim(),
                10
            );

            // create placeholder immediately
            const placeholder = createD(0, 1);

            placeholder.querySelectorAll('span')[1].textContent = '...';

            statsBar.prepend(placeholder);

            // fetch in background
            const activeDays = await getLifetimeActiveDays();

            if (!activeDays || activeDays <= 0) {
                placeholder.querySelectorAll('span')[1].textContent = 'N/A';
                return false;
            }

            // update placeholder
            placeholder.querySelectorAll('span')[1].textContent =
                (solved / activeDays).toFixed(2);

            return true;
        } finally {
            qpdRendering = false;
        }
    }


    const observer = new MutationObserver(async () => {
        addD();
        addButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();