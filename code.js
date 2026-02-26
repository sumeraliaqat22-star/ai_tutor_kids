document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const modeToggle = document.getElementById('mode-toggle');
    const blocksToolbox = document.getElementById('blocks-toolbox');
    const blockDropzone = document.getElementById('block-dropzone');
    const textEditorContainer = document.getElementById('text-editor-container');
    const codeTextarea = document.getElementById('code-textarea');
    const runBtn = document.getElementById('run-btn');
    const clearBtn = document.getElementById('clear-btn');
    const dropPlaceholder = document.getElementById('drop-placeholder');

    const actor = document.getElementById('the-actor');
    const consoleOutput = document.getElementById('console-output');

    const mascotFeedback = document.getElementById('mascot-feedback');
    const mascotSpeech = document.getElementById('mascot-speech');
    const xpVal = document.getElementById('xp-val');
    const confettiCanvas = document.getElementById('confetti');

    // --- State ---
    let isTextMode = false;
    let draggedBlock = null;

    // --- Mode Toggle ---
    modeToggle.addEventListener('change', (e) => {
        isTextMode = e.target.checked;
        if (isTextMode) {
            blocksToolbox.classList.remove('active');
            blockDropzone.classList.remove('active');
            textEditorContainer.classList.add('active');

            // Generate text from blocks
            const blocks = Array.from(blockDropzone.querySelectorAll('.draggable-block:not(.cloned-block-template)'));
            if (blocks.length > 0) {
                let generatedCode = "// Generated from your blocks:\n";
                blocks.forEach(b => {
                    generatedCode += getCommandFromAction(b.dataset.action) + "\n";
                });
                codeTextarea.value = generatedCode;
                clearBlocks();
            }

            mascotSpeech.textContent = "Text mode! You're writing real JS!";
        } else {
            blocksToolbox.classList.add('active');
            blockDropzone.classList.add('active');
            textEditorContainer.classList.remove('active');
            mascotSpeech.textContent = "Block mode! Snap them together.";
        }
    });

    // --- Drag and Drop Logic ---
    const toolboxBlocks = document.querySelectorAll('#blocks-toolbox .draggable-block');

    toolboxBlocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            draggedBlock = block;
            e.dataTransfer.setData('text/plain', block.dataset.action);
            setTimeout(() => block.style.opacity = '0.5', 0);
        });

        block.addEventListener('dragend', () => {
            block.style.opacity = '1';
            draggedBlock = null;
        });
    });

    blockDropzone.addEventListener('dragover', (e) => {
        e.preventDefault(); // allow drop
        blockDropzone.classList.add('drag-over');
    });

    blockDropzone.addEventListener('dragleave', () => {
        blockDropzone.classList.remove('drag-over');
    });

    blockDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        blockDropzone.classList.remove('drag-over');

        if (draggedBlock) {
            // Clone the block into the dropzone
            const newBlock = draggedBlock.cloneNode(true);
            newBlock.classList.add('dropped-block');
            newBlock.style.opacity = '1';

            // Add double click to remove
            newBlock.addEventListener('dblclick', () => {
                newBlock.remove();
                checkPlaceholder();
            });

            // Give it a title for removal info
            newBlock.title = "Double-click to remove";

            blockDropzone.appendChild(newBlock);
            checkPlaceholder();
            mascotSpeech.textContent = "Nice block! What's next?";
        }
    });

    function checkPlaceholder() {
        const blocks = blockDropzone.querySelectorAll('.draggable-block');
        if (blocks.length > 0) {
            dropPlaceholder.style.display = 'none';
        } else {
            dropPlaceholder.style.display = 'block';
        }
    }

    function clearBlocks() {
        const blocks = blockDropzone.querySelectorAll('.draggable-block');
        blocks.forEach(b => b.remove());
        checkPlaceholder();
    }

    // --- Execution Engine ---

    clearBtn.addEventListener('click', () => {
        if (isTextMode) {
            codeTextarea.value = "// Clean slate!\n";
        } else {
            clearBlocks();
        }
        resetActor();
        logConsole("Canvas cleared.");
        mascotSpeech.textContent = "Canvas is crystal clear!";
    });

    runBtn.addEventListener('click', async () => {
        resetActor();
        logConsole("Running program...", true);
        mascotSpeech.textContent = "Running code... 🏃‍♂️";

        let commands = [];

        if (isTextMode) {
            commands = parseTextCode(codeTextarea.value);
        } else {
            const blocks = blockDropzone.querySelectorAll('.draggable-block');
            blocks.forEach(b => commands.push(b.dataset.action));
        }

        if (commands.length === 0) {
            logConsole("Error: No commands to run.", false);
            mascotSpeech.textContent = "Oops! Add some code first.";
            actor.style.animation = "shake 0.5s";
            setTimeout(() => actor.style.animation = 'none', 500);
            return;
        }

        let success = true;
        // Execute commands sequentially
        for (let i = 0; i < commands.length; i++) {
            try {
                await executeCommand(commands[i]);
            } catch (e) {
                logConsole(`Error at step ${i + 1}: ${e}`, false);
                success = false;
                break;
            }
        }

        if (success) {
            handleSuccess();
        } else {
            mascotFeedback.textContent = "🦊";
            mascotSpeech.textContent = "Oh no, there was an error. Bug hunting time!";
        }
    });

    function getCommandFromAction(action) {
        switch (action) {
            case 'move-right': return 'moveRight();';
            case 'move-left': return 'moveLeft();';
            case 'color-blue': return 'makeBlue();';
            case 'color-yellow': return 'makeYellow();';
            case 'color-green': return 'makeGreen();';
            case 'spin': return 'spin();';
            case 'jump': return 'jump();';
            default: return `// unknown block`;
        }
    }

    function parseTextCode(code) {
        const lines = code.split('\n');
        const commands = [];
        lines.forEach(line => {
            const cleanLine = line.trim().replace(/;/g, '');
            if (!cleanLine || cleanLine.startsWith('//')) return; // skip empty and comments

            switch (cleanLine) {
                case 'moveRight()': commands.push('move-right'); break;
                case 'moveLeft()': commands.push('move-left'); break;
                case 'makeBlue()': commands.push('color-blue'); break;
                case 'makeYellow()': commands.push('color-yellow'); break;
                case 'makeGreen()': commands.push('color-green'); break;
                case 'spin()': commands.push('spin'); break;
                case 'jump()': commands.push('jump'); break;
                default:
                    // Create an intent to fail for unrecognized text
                    commands.push(`ERROR_${line}`);
            }
        });
        return commands;
    }

    // Actor State
    let actorPos = 0; // offset from center

    function executeCommand(action) {
        return new Promise((resolve, reject) => {
            if (action.startsWith('ERROR')) {
                reject("Unknown command: " + action.replace('ERROR_', ''));
                return;
            }

            logConsole(`Executing: ${action}`);

            switch (action) {
                case 'move-right':
                    actorPos += 50;
                    actor.style.transform = `translateX(${actorPos}px)`;
                    break;
                case 'move-left':
                    actorPos -= 50;
                    actor.style.transform = `translateX(${actorPos}px)`;
                    break;
                case 'color-blue':
                    actor.style.filter = "hue-rotate(180deg)";
                    break;
                case 'color-yellow':
                    actor.style.filter = "hue-rotate(50deg)";
                    break;
                case 'color-green':
                    actor.style.filter = "hue-rotate(90deg)";
                    break;
                case 'spin':
                    actor.style.transition = "transform 0.5s linear";
                    // Combine rotation with current translation
                    actor.style.transform = `translateX(${actorPos}px) rotate(360deg)`;
                    break;
                case 'jump':
                    actor.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                    actor.style.transform = `translateX(${actorPos}px) translateY(-50px)`;
                    setTimeout(() => {
                        actor.style.transform = `translateX(${actorPos}px) translateY(0)`;
                    }, 300);
                    break;
            }

            // Wait for visual completion
            setTimeout(() => {
                // reset spin transition so it doesn't spin back backwards
                if (action === 'spin') {
                    actor.style.transition = "transform 0.3s ease, left 0.5s ease";
                    actor.style.transform = `translateX(${actorPos}px) rotate(0deg)`;
                }
                resolve();
            }, 600);
        });
    }

    function resetActor() {
        actorPos = 0;
        actor.style.transition = "none";
        actor.style.transform = `translateX(0) translateY(0) rotate(0deg)`;
        actor.style.filter = "none";
        // Force reflow
        actor.offsetHeight;
        actor.style.transition = "transform 0.3s ease, left 0.5s ease";
    }

    function logConsole(msg, clear = false) {
        if (clear) consoleOutput.innerHTML = '';
        const line = document.createElement('div');
        line.textContent = `> ${msg}`;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function handleSuccess() {
        logConsole("Program finished successfully.");

        // Mascot Cheer
        mascotFeedback.textContent = "🥳";
        mascotFeedback.style.animation = "bounce 1s infinite";
        mascotSpeech.textContent = "YAY! IT WORKED! Thumbs up! 👍";

        // XP Pop
        let currentXp = parseInt(xpVal.textContent);
        xpVal.textContent = currentXp + 25;
        xpVal.parentElement.style.transform = 'scale(1.3)';
        xpVal.parentElement.style.backgroundColor = '#facc15';

        setTimeout(() => {
            xpVal.parentElement.style.transform = 'scale(1)';
            xpVal.parentElement.style.backgroundColor = '#e0e7ff';
            mascotFeedback.style.animation = "none";
            mascotFeedback.textContent = "🦊";
        }, 3000);

        shootConfetti();
    }

    // Reuse confetti logic from math.js
    function shootConfetti() {
        confettiCanvas.style.display = 'block';
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        let particles = [];
        const colors = ['#6366f1', '#a855f7', '#facc15', '#22c55e', '#ef4444'];

        for (let i = 0; i < 50; i++) {
            particles.push({
                x: confettiCanvas.width / 2,
                y: confettiCanvas.height / 2,
                r: Math.random() * 6 + 4,
                dx: Math.random() * 10 - 5,
                dy: Math.random() * -15 - 5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        let frames = 0;
        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                p.dy += 0.5; // gravity

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            frames++;
            if (frames < 100) {
                requestAnimationFrame(draw);
            } else {
                confettiCanvas.style.display = 'none';
            }
        }
        draw();
    }
});
