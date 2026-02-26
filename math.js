document.addEventListener('DOMContentLoaded', () => {

    // --- State & DOM Elements ---
    let currentLevelIndex = 0;

    // UI Elements
    const lessonTitle = document.getElementById('lesson-title');
    const xpVal = document.getElementById('xp-val');
    const questionTitle = document.getElementById('question-title');
    const questionText = document.getElementById('question-text');
    const inputContainer = document.getElementById('input-container');
    const feedback = document.getElementById('feedback');
    const gameBoard = document.getElementById('game-board-container');
    const checkBtn = document.getElementById('check-btn');

    // Modal
    const modal = document.getElementById('success-modal');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const confettiCanvas = document.getElementById('confetti');

    // --- Game Data ---
    const levels = [
        {
            id: 2,
            title: "Level 2: Geometry 📐",
            qTitle: "Shape Hunter!",
            qText: "Can you click on the <strong>Hexagon</strong>?",
            type: "geometry",
            shapes: [
                { id: "circle", class: "shape-circle" },
                { id: "square", class: "shape-square" },
                { id: "hexagon", class: "shape-hexagon" }
            ],
            target: "hexagon",
            points: 50
        },
        {
            id: 3,
            title: "Level 3: Multiplication 🍎",
            qTitle: "Apple Arrays!",
            qText: "What is <strong>3 x 4</strong>? Count the apples!",
            type: "multiplication",
            rows: 3,
            cols: 4,
            symbol: "🍎",
            target: 12,
            points: 50
        },
        {
            id: 4,
            title: "Level 4: Pizza Fractions 🍕",
            qTitle: "Time for Pizza!",
            qText: "Can you select exactly <strong>1/2</strong> of the pizza?",
            type: "fractions",
            totalSlices: 4,
            targetSlices: 2,
            points: 50
        }
    ];

    // Variables for cross-level state
    let geometrySelected = null;
    let mathAnswer = null;
    let pizzaSelectedSlices = 0;

    // --- Initialization ---
    // Start by optionally checking URL params, else load index 0
    const urlParams = new URLSearchParams(window.location.search);
    const startLevel = parseInt(urlParams.get('level')) || 2;
    currentLevelIndex = levels.findIndex(l => l.id === startLevel) !== -1 ? levels.findIndex(l => l.id === startLevel) : 0;

    loadLevel(currentLevelIndex);

    // --- Core Logic ---
    function loadLevel(index) {
        if (index >= levels.length) {
            // Finished all levels
            alert("You finished all Math levels!");
            window.location.href = "index.html";
            return;
        }

        const level = levels[index];

        // Reset UI
        lessonTitle.textContent = level.title;
        questionTitle.textContent = level.qTitle;
        questionText.innerHTML = level.qText;
        feedback.className = 'feedback-area';
        feedback.innerHTML = '';
        checkBtn.disabled = true;
        checkBtn.style.display = 'block';

        gameBoard.innerHTML = '';
        inputContainer.innerHTML = '';

        // Render based on type
        if (level.type === 'geometry') {
            renderGeometry(level);
        } else if (level.type === 'multiplication') {
            renderMultiplication(level);
        } else if (level.type === 'fractions') {
            renderFractions(level);
        }

        // Setup Check button
        checkBtn.onclick = () => evaluateAnswer(level);
    }

    // --- Renderers ---

    function renderGeometry(level) {
        geometrySelected = null;
        const container = document.createElement('div');
        container.className = 'shapes-container';

        // Shuffle shapes to make it random
        const shuffled = [...level.shapes].sort(() => Math.random() - 0.5);

        shuffled.forEach(s => {
            const shape = document.createElement('div');
            shape.className = `shape-item ${s.class}`;
            shape.dataset.id = s.id;

            shape.onclick = () => {
                // Deselect others
                container.querySelectorAll('.shape-item').forEach(el => {
                    el.style.border = 'none';
                    el.style.transform = '';
                });

                // Select current
                shape.style.border = '4px solid var(--accent)';
                shape.style.transform = 'scale(1.1)';

                geometrySelected = shape.dataset.id;

                checkBtn.disabled = false;
                resetFeedback();
            };

            container.appendChild(shape);
        });

        gameBoard.appendChild(container);
    }

    function renderMultiplication(level) {
        mathAnswer = null;

        // Render grid
        const grid = document.createElement('div');
        grid.className = 'grid-container';

        for (let r = 0; r < level.rows; r++) {
            const row = document.createElement('div');
            row.className = 'grid-row';
            for (let c = 0; c < level.cols; c++) {
                const item = document.createElement('div');
                item.className = 'grid-item';
                item.textContent = level.symbol;
                // Add staggered animation delay
                item.style.animationDelay = `${(r * level.cols + c) * 0.05}s`;
                row.appendChild(item);
            }
            grid.appendChild(row);
        }
        gameBoard.appendChild(grid);

        // Render input area in the instruction panel
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'grid-input-area';

        const label = document.createElement('label');
        label.textContent = "Your Answer:";
        label.style.fontWeight = '700';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'grid-input';
        input.placeholder = "?";

        input.addEventListener('input', (e) => {
            mathAnswer = parseInt(e.target.value);
            checkBtn.disabled = isNaN(mathAnswer);
            resetFeedback();
        });

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(input);

        inputContainer.appendChild(inputWrapper);
    }

    function renderFractions(level) {
        pizzaSelectedSlices = 0;

        const container = document.createElement('div');
        container.className = 'pizza-container';

        const pizza = document.createElement('div');
        pizza.className = 'pizza';
        pizza.id = 'pizza-board';

        for (let i = 1; i <= level.totalSlices; i++) {
            const slice = document.createElement('div');
            slice.className = `pizza-slice slice-${i}`;
            slice.dataset.index = i;

            slice.onclick = () => {
                slice.classList.toggle('selected');

                pizzaSelectedSlices = pizza.querySelectorAll('.pizza-slice.selected').length;
                updatePizzaFractionDisplay(pizzaSelectedSlices, level.totalSlices);

                checkBtn.disabled = false;
                resetFeedback();
            };

            pizza.appendChild(slice);
        }

        const fractionDisplay = document.createElement('div');
        fractionDisplay.className = 'fraction-display';
        fractionDisplay.innerHTML = `Selected: <span id="current-fraction">0/${level.totalSlices}</span>`;

        container.appendChild(pizza);
        container.appendChild(fractionDisplay);

        gameBoard.appendChild(container);
    }

    function updatePizzaFractionDisplay(selected, total) {
        const fracDisplay = document.getElementById('current-fraction');
        if (!fracDisplay) return;

        let displayStr = `${selected}/${total}`;
        if (selected === 2 && total === 4) {
            displayStr = `2/4 (which is 1/2!)`;
        } else if (selected === total) {
            displayStr = `4/4 (1 Whole!)`;
        }
        fracDisplay.textContent = displayStr;
    }

    // --- Evaluation & Feedback ---

    function resetFeedback() {
        feedback.className = 'feedback-area';
        feedback.innerHTML = '';
        gameBoard.style.animation = ''; // stop shaking
    }

    function evaluateAnswer(level) {
        let isCorrect = false;

        if (level.type === 'geometry') {
            isCorrect = (geometrySelected === level.target);
        } else if (level.type === 'multiplication') {
            isCorrect = (mathAnswer === level.target);
        } else if (level.type === 'fractions') {
            isCorrect = (pizzaSelectedSlices === level.targetSlices);
        }

        if (isCorrect) {
            handleSuccess(level);
        } else {
            handleError();
        }
    }

    function handleSuccess(level) {
        feedback.innerHTML = "Great job! That's correct! 🎉";
        feedback.className = 'feedback-area feedback-success show';
        checkBtn.disabled = true;

        // Animate XP
        let currentXp = parseInt(xpVal.textContent);
        xpVal.textContent = currentXp + level.points;
        xpVal.parentElement.style.transform = 'scale(1.3)';
        xpVal.parentElement.style.backgroundColor = '#facc15';

        setTimeout(() => {
            xpVal.parentElement.style.transform = 'scale(1)';
            xpVal.parentElement.style.backgroundColor = '#e0e7ff';
        }, 500);

        // Fun interaction depending on game
        if (level.type === 'geometry') {
            const selectedShape = document.querySelector(`.shape-item[data-id="${level.target}"]`);
            if (selectedShape) {
                selectedShape.classList.add('correct-pulse');
            }
        }

        // Show specific modal content
        setTimeout(() => showModal(level), 1000);
    }

    function handleError() {
        feedback.innerHTML = "Oops! Not quite. Keep trying! 🤔";
        feedback.className = 'feedback-area feedback-error show';

        gameBoard.style.animation = 'none';
        gameBoard.offsetHeight; // trigger reflow
        gameBoard.style.animation = 'shake 0.5s';
    }

    function showModal(level) {
        if (currentLevelIndex < levels.length - 1) {
            nextLevelBtn.style.display = 'inline-block';
            nextLevelBtn.textContent = 'Next Level ➔';
            document.getElementById('modal-text').innerHTML = `You earned +${level.points} XP! Ready for the next challenge?`;
        } else {
            nextLevelBtn.style.display = 'none'; // hide if last level
            document.getElementById('modal-text').innerHTML = `You earned +${level.points} XP! You are a Math Master! 🦸‍♂️`;
        }

        modal.classList.add('active');
        shootConfetti();
    }

    nextLevelBtn.onclick = () => {
        modal.classList.remove('active');
        confettiCanvas.style.display = 'none';
        currentLevelIndex++;
        loadLevel(currentLevelIndex);
    };

    // --- Visuals ---

    // Simple confetti overlay system
    function shootConfetti() {
        confettiCanvas.style.display = 'block';
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        let particles = [];
        const colors = ['#6366f1', '#a855f7', '#facc15', '#22c55e', '#ef4444'];

        for (let i = 0; i < 100; i++) {
            particles.push({
                x: confettiCanvas.width / 2,
                y: confettiCanvas.height / 2 + 100,
                r: Math.random() * 6 + 4,
                dx: Math.random() * 10 - 5,
                dy: Math.random() * -15 - 5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            let active = false;

            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                p.dy += 0.5; // gravity

                if (p.y < confettiCanvas.height) active = true;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            if (active && modal.classList.contains('active')) {
                requestAnimationFrame(draw);
            }
        }

        draw();
    }
});
