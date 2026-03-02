function runCode() {
    const editorValue = document.getElementById('code-editor').value;
    const magicBox = document.getElementById('magic-box');
    
    // Simple color logic
    if (editorValue.includes('blue')) {
        magicBox.style.backgroundColor = 'blue';
    } else if (editorValue.includes('red')) {
        magicBox.style.backgroundColor = 'red';
    } else if (editorValue.includes('yellow')) {
        magicBox.style.backgroundColor = 'yellow';
    }

    // Animation trigger
    magicBox.style.animation = 'none';
    magicBox.offsetHeight; 
    magicBox.style.animation = 'bounce 1s infinite';
}