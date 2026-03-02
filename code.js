document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const actor = document.getElementById('the-actor');
    const dropzone = document.getElementById('block-dropzone');
    const placeholder = document.getElementById('drop-placeholder');
    const runBtn = document.getElementById('run-btn');
    const clearBtn = document.getElementById('clear-btn');
    const modeToggle = document.getElementById('mode-toggle');
    const blocksToolbox = document.getElementById('blocks-toolbox');
    const textEditor = document.getElementById('text-editor-container');
    const consoleOutput = document.getElementById('console-output');

    // --- Mode Switching (Blocks vs Text) ---
    modeToggle.addEventListener('change', () => {
        if (modeToggle.checked) {
            blocksToolbox.classList.remove('active');
            dropzone.classList.remove('active');
            textEditor.classList.add('active');
            logConsole("Switched to Text Mode (JavaScript)");
        } else {
            blocksToolbox.classList.add('active');
            dropzone.classList.add('active');
            textEditor.classList.remove('active');
            logConsole("Switched to Block Mode");
        }
    });

    // --- Drag and Drop Logic ---
    const blocks = document.querySelectorAll('.draggable-block');
    blocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('action', block.dataset.action);
            e.dataTransfer.setData('text', block.innerHTML);
            e.dataTransfer.setData('class', block.className);
        });
    });

    dropzone.addEventListener('dragover', (e) => e.preventDefault());

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        placeholder.style.display = 'none';

        const action = e.dataTransfer.getData('action');
        const text = e.dataTransfer.getData('text');
        const className = e.dataTransfer.getData('class');

        const newBlock = document.createElement('div');
        newBlock.className = className + ' dropped-block';
        newBlock.innerHTML = text;
        newBlock.dataset.action = action;
        
        // Block ko delete karne ka option (right click)
        newBlock.addEventListener('contextmenu', (ev) => {
            ev.preventDefault();
            newBlock.remove();
            if (dropzone.children.length <= 1) placeholder.style.display = 'block';
        });

        dropzone.appendChild(newBlock);
        logConsole(`Added: ${action}`);
    });

    // --- Execution Logic ---
    runBtn.addEventListener('click', () => {
        if (!modeToggle.checked) {
            // Block Mode Execution
            const droppedBlocks = dropzone.querySelectorAll('.dropped-block');
            if (droppedBlocks.length === 0) {
                logConsole("No blocks to run!");
                return;
            }
            logConsole("Running blocks...");
            executeSequence(Array.from(droppedBlocks).map(b => b.dataset.action));
        } else {
            // Text Mode (Simple Simulation)
            logConsole("Text mode execution coming soon!");
        }
    });

    function executeSequence(actions) {
        actions.forEach((action, index) => {
            setTimeout(() => {
                runAction(action);
            }, index * 800);
        });
    }

    function runAction(action) {
        switch (action) {
            case 'move-right':
                let left = parseInt(actor.style.left || 50);
                actor.style.left = (left + 10) + "%";
                break;
            case 'move-left':
                let rLeft = parseInt(actor.style.left || 50);
                actor.style.left = (rLeft - 10) + "%";
                break;
            case 'jump':
                actor.style.transform = "translateY(-50px)";
                setTimeout(() => actor.style.transform = "translateY(0)", 300);
                break;
            case 'spin':
                actor.style.transition = "transform 0.5s";
                actor.style.transform = "rotate(360deg)";
                setTimeout(() => actor.style.transform = "rotate(0deg)", 500);
                break;
            case 'color-blue':
                actor.style.background = "#3b82f6";
                actor.style.borderRadius = "10px";
                break;
            case 'color-yellow':
                actor.style.background = "#facc15";
                actor.style.borderRadius = "10px";
                break;
            case 'color-green':
                actor.style.background = "#10b981";
                actor.style.borderRadius = "10px";
                break;
        }
        logConsole(`Executed: ${action}`);
    }

    function logConsole(msg) {
        consoleOutput.innerHTML += `<div>> ${msg}</div>`;
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    clearBtn.addEventListener('click', () => {
        dropzone.querySelectorAll('.dropped-block').forEach(b => b.remove());
        placeholder.style.display = 'block';
        actor.style = ""; // Reset actor
        consoleOutput.innerHTML = "System Ready...";
    });
});