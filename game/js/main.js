let game = null;

window.onload = function() {
    initializeGame();
};

function initializeGame() {
    hideAllScreens();
    document.getElementById('start-screen').classList.remove('hidden');
}

function hideAllScreens() {
    const screens = ['start-screen', 'intro-screen', 'game-screen', 'game-over-screen'];
    screens.forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
    });
}

function startIntro() {
    const introSequence = new IntroSequence();
    introSequence.start();
}

function startGame() {
    hideAllScreens();
    document.getElementById('game-screen').classList.remove('hidden');
    
    if (!game) {
        game = new Game();
    }
    game.startGame();
}

// 改进错误处理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Game Error:', {
        message: msg,
        url: url,
        lineNumber: lineNo,
        columnNumber: columnNo,
        error: error
    });
    
    // 显示用户友好的错误提示
    new Modal({
        title: '游戏错误',
        content: '游戏运行出现错误，请刷新页面重试。',
        type: 'error',
        buttons: [{
            text: '刷新页面',
            type: 'primary',
            onClick: () => window.location.reload()
        }]
    }).show();
    
    return false;
};