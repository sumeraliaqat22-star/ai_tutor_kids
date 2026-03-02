const levels = [
    {
        title: "Fraction Fun",
        instruction: "Can you pick slices to make 2/4 of the pizza?",
        target: 2,
        total: 4,
        type: "pizza"
    }
];

let currentLevel = 0;
let selectedSlices = 0;

const questionText = document.getElementById('question-text');
const pizzaBase = document.getElementById('pizza-base');
const feedback = document.getElementById('feedback');
const checkBtn = document.getElementById('check-btn');

function loadLevel() {
    const level = levels[currentLevel];
    if (document.getElementById('lesson-title')) {
        document.getElementById('lesson-title').innerText = level.title;
    }
    if (questionText) questionText.innerText = level.instruction;
    if (level.type === "pizza") { createPizza(level.total); }
}

function createPizza(totalSlices) {
    if (!pizzaBase) return;
    pizzaBase.innerHTML = '';
    selectedSlices = 0;
    for (let i = 1; i <= totalSlices; i++) {
        const slice = document.createElement('div');
        slice.classList.add('pizza-slice', `slice-${i}`);
        slice.onclick = () => {
            slice.classList.toggle('selected');
            selectedSlices = document.querySelectorAll('.pizza-slice.selected').length;
            if (feedback) feedback.innerText = `Selected: ${selectedSlices}`;
        };
        pizzaBase.appendChild(slice);
    }
}

if (checkBtn) {
    checkBtn.onclick = () => {
        if (selectedSlices === levels[currentLevel].target) {
            alert("Bohat achay! Sahi jawab. 🎉");
            document.getElementById('success-modal').classList.add('active');
        } else {
            alert("Dobara koshish karein! 🍕");
        }
    };
}

loadLevel();