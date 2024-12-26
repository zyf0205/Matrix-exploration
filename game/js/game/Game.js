class Game {
    constructor() {
        this.init();
        // 在构造函数中获取元素引用
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level-num');
        this.timeElement = document.getElementById('time-remaining');
        
        // 修改输入框验证
        const inputBoxes = document.querySelectorAll('.input-box');
        inputBoxes.forEach(input => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // 允许以下情况：
                // 1. 空字符串
                // 2. 单个负号
                // 3. 负号后跟数字
                // 4. 纯数字
                if (value === '' || 
                    value === '-' || 
                    /^-?\d+$/.test(value)) {
                    return;
                }
                
                // 清理无效字符，保留负号和数字
                e.target.value = value.replace(/[^\d-]/g, '')
                                    .replace(/(-.*)-+/g, '$1'); // 只保留第一个负号
            });
        });
        this.isProcessingAnswer = false;
    }

    init() {
        console.log('Game initializing...');
        
        // 初始化游戏状态
        this.score = 0;
        this.isGameOver = false;
        
        // 获取游戏场景
        this.gameScene = document.querySelector('.game-scene');
        if (!this.gameScene) {
            console.error('Game scene not found');
            return;
        }
        
        // 初始化星空背景
        this.initStarryBackground();
        
        // 创建宇航员
        this.player = new Player(this.gameScene);
        
        // 初始化关卡
        this.level = new Level(this.gameScene);
        
        // 初始化显示元素
        this.initDisplayElements();
        
        // 初始化事件监听
        this.initEventListeners();
        
        // 开始第一关
        this.startLevel(1);
    }

    initStarryBackground() {
        // 创建星星背景
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'background-star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            this.gameScene.appendChild(star);
        }
    }

    initDisplayElements() {
        // 初始化显示元素
        this.scoreDisplay = document.getElementById('score-display');
        this.levelDisplay = document.getElementById('level-display');
        this.timeDisplay = document.querySelector('#time-remaining');
        
        // 初始化显示
        this.updateScore(0);
        this.updateLevel(1);
    }

    startLevel(levelNum) {
        // 设置当前关卡
        this.level.currentLevel = levelNum;
        this.updateLevel(levelNum);
        
        // 生成新的矩阵和星星
        this.level.generateMatrix();
        this.level.generateStars(1);
        
        // 重置时间
        this.timeRemaining = this.level.getLevelTimeLimit();
        this.lastTick = Date.now();
        
        // 开始计时
        this.startTimer();
    }

    initEventListeners() {
        // 初始化提交按钮事件
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        } else {
            console.error('Submit button not found');
        }

        // 初始化重新开始按钮事件
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                const gameOverScreen = document.getElementById('game-over-screen');
                if (gameOverScreen) {
                    gameOverScreen.classList.add('hidden');
                }
                this.restart();
            });
        }

        // 添加键盘事件监听（如果需要）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleSubmit();
            }
        });
    }

    updateScore(newScore) {
        this.score = newScore;
        if (this.scoreElement) {
            // 直接更新数字内容,而不是整个文本
            this.scoreElement.textContent = this.score;
        }
    }

    updateLevel(newLevel) {
        if (this.levelElement) {
            // 直接更新数字内容,而不是整个文本
            this.levelElement.textContent = newLevel;
        }
    }

    handleSubmit() {
        try {
            const result = this.validateAnswer();
            if (result) {
                // 答案正确的处理逻辑
                this.handleCorrectAnswer();
            } else {
                // 答案错误的处理逻辑
                this.handleWrongAnswer();
            }
        } catch (error) {
            console.error('检查答案时出错:', error);
        }
    }

    handleCorrectAnswer() {
        if (this.isProcessingAnswer) return;
        this.isProcessingAnswer = true;

        // 找到最近的星星
        const nearestStar = this.level.stars[0];
        if (!nearestStar) {
            this.isProcessingAnswer = false;
            return;
        }

        // 禁用输入
        this.disableInputs(true);

        // 获取游戏场景的边界
        const sceneBounds = this.gameScene.getBoundingClientRect();
        
        // 计算宇航员和星星的中心点对齐位置
        const starBounds = nearestStar.element.getBoundingClientRect();
        const targetX = starBounds.left - sceneBounds.left;
        const targetY = starBounds.top - sceneBounds.top;

        console.log('Scene bounds:', sceneBounds);
        console.log('Star bounds:', starBounds);
        console.log('Moving player to:', { targetX, targetY });

        // 移动宇航员
        this.player.moveTo(targetX, targetY, () => {
            // 星星消失动画
            nearestStar.element.style.transition = 'all 500ms ease-out';
            nearestStar.element.style.transform = 'scale(0)';
            nearestStar.element.style.opacity = '0';

            setTimeout(() => {
                // 移除星星
                if (nearestStar.element.parentNode) {
                    nearestStar.element.parentNode.removeChild(nearestStar.element);
                }
                this.level.stars.shift();

                // 更新分数
                this.updateScore(this.score + 150);

                // 清空输入框
                this.clearInputs();

                // 显示成功消息
                this.showMessage(`恭喜通过第 ${this.level.currentLevel} 关！`, 'success');

                // 延迟进入下一关
                setTimeout(() => {
                    this.nextLevel();
                    this.disableInputs(false);
                    this.isProcessingAnswer = false;
                }, 1000);
            }, 500);
        });
    }

    handleWrongAnswer() {
        // 显示错误消息
        this.showMessage('答案错误，请重试', 'error');
        
        // 清空输入框
        this.clearInputs();
        
        // 可以添加其他错误处理逻辑，比如减少时间或分数
    }

    showMessage(text, type = 'info') {
        // 创建消息元素
        const message = document.createElement('div');
        message.className = `game-message ${type}`;
        message.textContent = text;
        
        // 添加到页面
        document.body.appendChild(message);
        
        // 2秒后移除
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    nextLevel() {
        // 清除当前关卡的所有星星
        this.level.stars.forEach(star => {
            if (star.element && star.element.parentNode) {
                star.element.parentNode.removeChild(star.element);
            }
        });
        this.level.stars = [];
        
        // 重置玩家位置
        this.player.reset();
        
        // 更新关卡
        this.level.currentLevel++;
        this.updateLevel(this.level.currentLevel);
        
        // 重置时间
        this.timeRemaining = this.level.getLevelTimeLimit();
        
        // 延迟生成新的矩阵和星星
        setTimeout(() => {
            this.level.generateMatrix();
            this.level.generateStars(1);
        }, 100);
    }

    restart() {
        // 清除旧的游戏状态
        this.clearGameState();
        
        // 重置游戏状态
        this.score = 0;
        this.isGameOver = false;
        
        // 更新显示
        this.updateScore(0);
        this.updateLevel(1);
        
        // 清空输入框
        this.clearInputs();
        
        // 重置关卡
        this.level.currentLevel = 1;
        this.level.generateMatrix();
        this.level.generateStars(1);
        
        // 重置玩家位置
        if (this.player) {
            this.player.reset();
        }
        
        // 重新开始计时
        this.timeRemaining = this.level.getLevelTimeLimit();
        this.lastTick = Date.now();
        this.startTimer();
        
        // 隐藏游戏结束界面
        const gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
    }

    clearGameState() {
        // 停止当前计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 清除所有星星
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => star.remove());
        
        // 清除所有背景星星
        const bgStars = document.querySelectorAll('.background-star');
        bgStars.forEach(star => star.remove());
    }

    clearInputs() {
        // 清空所有输入框
        const inputs = [
            'λ1', 'λ2',
            'x1', 'y1',
            'x2', 'y2'
        ];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = '';
            }
        });
    }

    updateTimerDisplay() {
        const timeDisplay = document.getElementById('time-remaining');
        if (timeDisplay) {
            timeDisplay.textContent = Math.max(0, Math.ceil(this.timeRemaining));
        }
    }

    startTimer() {
        // 清除旧的计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timeRemaining = this.level.getLevelTimeLimit();
        this.lastTick = Date.now();
        
        const tick = () => {
            if (this.isGameOver) return;
            
            const now = Date.now();
            const delta = now - this.lastTick;
            this.lastTick = now;
            
            this.timeRemaining -= delta / 1000;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.gameOver();
                return;
            }
            
            requestAnimationFrame(tick);
        };
        
        requestAnimationFrame(tick);
    }

    gameOver() {
        this.isGameOver = true;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) {
            const finalLevel = document.getElementById('final-level');
            const finalScore = document.getElementById('final-score');
            
            if (finalLevel) finalLevel.textContent = this.level.currentLevel;
            if (finalScore) finalScore.textContent = this.score;
            
            gameOverScreen.classList.remove('hidden');
            
            const restartBtn = document.getElementById('restart-btn');
            if (restartBtn) {
                restartBtn.onclick = () => {
                    gameOverScreen.classList.add('hidden');
                    this.restart();
                };
            }
        }
    }

    validateAnswer() {
        // 获取所有输入值
        const λ1 = parseFloat(document.getElementById('λ1')?.value);
        const λ2 = parseFloat(document.getElementById('λ2')?.value);
        const x1 = parseFloat(document.getElementById('x1')?.value);
        const y1 = parseFloat(document.getElementById('y1')?.value);
        const x2 = parseFloat(document.getElementById('x2')?.value);
        const y2 = parseFloat(document.getElementById('y2')?.value);

        // 输出调试信息
        console.log('验证输入值:', {λ1, λ2, x1, y1, x2, y2});

        // 检查是否所有输入都是有效数字
        if ([λ1, λ2, x1, y1, x2, y2].some(val => isNaN(val))) {
            console.log('存在无效输入');
            return false;
        }

        // 获取正确的特征值和特征向量
        const { eigenvalues, eigenvectors } = this.level.currentMatrix;
        
        // 检查特征值是否匹配（考虑顺序可能不同）
        const inputEigenvalues = [λ1, λ2].sort((a, b) => b - a); // 降序排列
        const correctEigenvalues = [...eigenvalues].sort((a, b) => b - a);
        
        // 检查输入的特征向量
        const inputVectors = [
            [x1, y1],
            [x2, y2]
        ];

        // 验证特征值和特征向量
        const isValidEigenpair = (λ, v, matrix) => {
            // 计算 Av
            const Av = [
                matrix[0][0] * v[0] + matrix[0][1] * v[1],
                matrix[1][0] * v[0] + matrix[1][1] * v[1]
            ];
            
            // 计算 λv
            const λv = [λ * v[0], λ * v[1]];
            
            // 检查 Av = λv
            const epsilon = 0.0001;
            return Math.abs(Av[0] - λv[0]) < epsilon && 
                   Math.abs(Av[1] - λv[1]) < epsilon;
        };

        // 检查每个特征对
        const isCorrect = inputEigenvalues.every((λ, i) => 
            Math.abs(λ - correctEigenvalues[i]) < 0.0001) && 
            inputVectors.some((v, i) => 
                isValidEigenpair(inputEigenvalues[i], v, this.level.currentMatrix.matrix));

        console.log('验证结果:', {
            inputEigenvalues,
            correctEigenvalues,
            inputVectors,
            correctVectors: eigenvectors,
            isCorrect
        });

        return isCorrect;
    }

    // 添加新的辅助方法
    disableInputs(disabled) {
        const submitBtn = document.querySelector('.submit-btn');
        const inputs = document.querySelectorAll('.input-box');
        if (submitBtn) submitBtn.disabled = disabled;
        inputs.forEach(input => input.disabled = disabled);
    }
}

// 确保在页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    window.game = new Game();
}); 