// Simple Gamification Interaction

document.addEventListener('DOMContentLoaded', () => {

    // Animate XP Counter on load
    const xpCounter = document.querySelector('#xp-counter span');
    if (xpCounter) {
        let currentXP = 0;
        const targetXP = parseInt(xpCounter.textContent) || 450;
        const increment = targetXP / 50; // speed of count

        const countUp = setInterval(() => {
            currentXP += increment;
            if (currentXP >= targetXP) {
                xpCounter.textContent = targetXP;
                clearInterval(countUp);
                // Add a little pop animation when done
                xpCounter.parentElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    xpCounter.parentElement.style.transform = 'scale(1)';
                }, 200);
            } else {
                xpCounter.textContent = Math.floor(currentXP);
            }
        }, 20);

        // Button click effects (simulate earning XP)
        const actionBtns = document.querySelectorAll('.btn-primary');
        actionBtns.forEach(btn => {
            if (btn.id !== 'login-btn') {
                btn.addEventListener('click', function () {
                    let current = parseInt(xpCounter.textContent);
                    xpCounter.textContent = current + 50;

                    // Visual pop
                    xpCounter.parentElement.style.transform = 'scale(1.2)';
                    xpCounter.parentElement.style.backgroundColor = '#facc15';
                    setTimeout(() => {
                        xpCounter.parentElement.style.transform = 'scale(1)';
                        xpCounter.parentElement.style.backgroundColor = '#e0e7ff';
                    }, 300);
                });
            }
        });
    }
});

// Code Sandbox Simulator
function runCode() {
    const code = document.getElementById('code-editor').value;
    const magicBox = document.getElementById('magic-box');

    // Very basic CSS parser for the sandbox
    try {
        // Extract properties from the textarea content
        const bgMatch = code.match(/background-color:\s*([^;]+);/i);
        const radiusMatch = code.match(/border-radius:\s*([^;]+);/i);

        if (bgMatch && bgMatch[1]) {
            magicBox.style.backgroundColor = bgMatch[1].trim();
        }

        if (radiusMatch && radiusMatch[1]) {
            magicBox.style.borderRadius = radiusMatch[1].trim();
        }

        // Trigger animation reset
        magicBox.style.animation = 'none';
        magicBox.offsetHeight; /* trigger reflow */

        const animMatch = code.match(/animation:\s*([^;]+);/i);
        if (animMatch && animMatch[1]) {
            magicBox.style.animation = animMatch[1].trim();
        }

    } catch (e) {
        console.error("Oops! Check your code.");
    }
}
