document.addEventListener('DOMContentLoaded', () => {
    const actor = document.getElementById('the-actor');
    const dropzone = document.getElementById('block-dropzone');
    const placeholder = document.getElementById('drop-placeholder');
    const runBtn = document.getElementById('run-btn'); // Aapki HTML mein yehi ID hai
    const clearBtn = document.getElementById('clear-btn');
    const consoleOutput = document.getElementById('console-output');

    // Drag and Drop Logic
    const blocks = document.querySelectorAll('.draggable-block');
    blocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('action', block.dataset.action);
        });
    });

    dropzone.addEventListener('dragover', (e) => e.preventDefault());

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        const action = e.dataTransfer.getData('action');
        if (placeholder) placeholder.style.display = 'none';

        const newBlock = document.createElement('div');
        newBlock.className = 'draggable-block dropped-block';
        newBlock.innerHTML = action.replace('-', ' ').toUpperCase();
        newBlock.dataset.action = action;
        
        dropzone.appendChild(newBlock);
        logConsole(`Added to sequence: ${action}`);
    });

    // Run Logic
    runBtn.addEventListener('click', () => {
        const droppedBlocks = dropzone.querySelectorAll('.dropped-block');
        if (droppedBlocks.length === 0) {
            logConsole("Error: No blocks in dropzone!");
            return;
        }
        
        droppedBlocks.forEach((block, index) => {
            setTimeout(() => {
                executeAction(block.dataset.action);
            }, index * 1000); // 1 block per second
        });
    });

    function executeAction(action) {
        logConsole(`Executing: ${action}`);
        actor.className = 'actor'; // Reset classes
        
        if (action === 'move-right') {
            let currentLeft = parseInt(window.getComputedStyle(actor).left);
            actor.style.left = (currentLeft + 50) + "px";
        } else if (action === 'move-left') {
            let currentLeft = parseInt(window.getComputedStyle(actor).left);
            actor.style.left = (currentLeft - 50) + "px";
        } else if (action === 'jump') {
            actor.classList.add('jump-anim');
        } else if (action === 'spin') {
            actor.classList.add('spin-anim');
        } else if (action.startsWith('color')) {
            actor.style.backgroundColor = action.split('-')[1];
            actor.style.borderRadius = "50%";
        }
    }

    function logConsole(msg) {
        if (consoleOutput) {
            consoleOutput.innerHTML += `<div>> ${msg}</div>`;
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
    }

    clearBtn.onclick = () => {
        dropzone.querySelectorAll('.dropped-block').forEach(b => b.remove());
        if (placeholder) placeholder.style.display = 'block';
        actor.style.left = "50%";
        actor.style.backgroundColor = "transparent";
        logConsole("Cleared!");
    };
});