const quests = [
    { type: 'pizza', target: 2, text: "Can you eat 2/4 of the pizza? (Click 2 slices)" },
    { type: 'addition', target: 8, text: "Quick! What is 5 + 3?" },
    { type: 'shapes', target: 'circle', text: "Can you find the Round Circle?" }
];

let currentQuest = 0;
let score = 450;
let userSelection = null;

const area = document.getElementById('interactive-area');
const instruction = document.getElementById('instruction-text');
const feedback = document.getElementById('feedback-text');
const actionBtn = document.getElementById('main-action-btn');

function startQuest() {
    const q = quests[currentQuest];
    instruction.innerText = q.text;
    area.innerHTML = '';
    feedback.innerText = '';
    userSelection = null;

    if (q.type === 'pizza') {
        const pizza = document.createElement('div');
        pizza.className = 'pizza-circle';
        for(let i=0; i<4; i++) {
            const slice = document.createElement('div');
            slice.className = 'slice';
            slice.onclick = () => {
                slice.classList.toggle('selected');
                userSelection = document.querySelectorAll('.selected').length;
            };
            pizza.appendChild(slice);
        }
        area.appendChild(pizza);
    } 
    else if (q.type === 'addition') {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'math-input';
        input.placeholder = "?";
        input.oninput = (e) => userSelection = parseInt(e.target.value);
        area.appendChild(input);
    }
    else if (q.type === 'shapes') {
        const shapes = ['square', 'circle', 'triangle'];
        shapes.forEach(s => {
            const div = document.createElement('div');
            div.className = `shape ${s}`;
            div.onclick = () => {
                document.querySelectorAll('.shape').forEach(el => el.style.border="none");
                div.style.border = "5px solid yellow";
                userSelection = s;
            };
            area.appendChild(div);
        });
    }
}

actionBtn.onclick = () => {
    if (userSelection === quests[currentQuest].target) {
        document.getElementById('win-modal').style.display = 'flex';
    } else {
        feedback.innerText = "Oops! Try again! 🦊";
        feedback.style.color = "#ff4444";
    }
};

document.getElementById('next-btn').onclick = () => {
    document.getElementById('win-modal').style.display = 'none';
    currentQuest = (currentQuest + 1) % quests.length;
    document.getElementById('level-num').innerText = currentQuest + 1;
    startQuest();
};

startQuest();