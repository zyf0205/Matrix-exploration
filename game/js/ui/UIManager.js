class UIManager {
    constructor() {
        this.mainMenu = document.getElementById('main-menu');
        this.gameScreen = document.getElementById('game-screen');
        this.levelDisplay = document.getElementById('level-num');
        this.scoreDisplay = document.getElementById('score');
        this.matrixDisplay = document.getElementById('matrix-display');
    }

    showMainMenu() {
        this.mainMenu.classList.remove('hidden');
        this.gameScreen.classList.add('hidden');
    }

    showGameScreen() {
        this.mainMenu.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
    }

    updateLevel(level) {
        this.levelDisplay.textContent = level;
    }

    updateScore(score) {
        this.scoreDisplay.textContent = score;
    }

    updateMatrix(matrix) {
        this.matrixDisplay.innerHTML = this.formatMatrix(matrix);
    }

    formatMatrix(matrix) {
        return `
            <table class="matrix">
                ${matrix.map(row => `
                    <tr>
                        ${row.map(cell => `
                            <td>${cell}</td>
                        `).join('')}
                    </tr>
                `).join('')}
            </table>
        `;
    }

    showModal(options) {
        const modal = new Modal({
            title: options.title || '',
            content: options.content || '',
            buttons: options.buttons || [{
                text: '确定',
                onClick: options.onConfirm || (() => {})
            }]
        });
        modal.show();
    }

    showError(message) {
        this.showModal({
            title: '错误',
            content: message
        });
    }

    showSuccess(message) {
        this.showModal({
            title: '成功',
            content: message
        });
    }

    togglePause(isPaused) {
        const pauseBtn = document.getElementById('pause-btn');
        pauseBtn.textContent = isPaused ? '继续' : '暂停';
    }
} 