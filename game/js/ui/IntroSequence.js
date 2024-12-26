class IntroSequence {
    constructor() {
        this.introScreen = document.getElementById('intro-screen');
        this.introText = this.introScreen.querySelector('.intro-text');
        this.introContent = [
            "欢迎来到矩阵特征值与特征向量的探索之旅",
            "在这个宇宙中，每个星星都蕴含着矩阵的奥秘",
            "解出矩阵的特征值(λ)和对应的特征向量(v)",
            "满足方程 Av = λv 即可收集星星",
            "特征值和特征向量都正确才能获得分数",
            "准备好开始你的线性代数探索了吗？"
        ];
    }

    async start() {
        hideAllScreens();
        this.introScreen.classList.remove('hidden');
        this.introScreen.style.opacity = '1';
        
        for (let text of this.introContent) {
            await this.showText(text);
            await this.wait(2000);
            await this.fadeText();
            await this.wait(500);
        }

        await this.fadeOutIntro();
        
        hideAllScreens();
        document.getElementById('game-screen').classList.remove('hidden');
        if (!window.game) {
            window.game = new Game();
        }
        window.game.init();
    }

    showText(text) {
        return new Promise(resolve => {
            this.introText.style.opacity = '0';
            this.introText.textContent = '';
            
            setTimeout(() => {
                this.introText.style.opacity = '1';
                let i = 0;
                const typeWriter = () => {
                    if (i < text.length) {
                        this.introText.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 50); // 打字速度
                    } else {
                        resolve();
                    }
                };
                typeWriter();
            }, 100);
        });
    }

    fadeText() {
        return new Promise(resolve => {
            this.introText.style.opacity = '0';
            setTimeout(resolve, 1000);
        });
    }

    fadeOutIntro() {
        return new Promise(resolve => {
            this.introScreen.style.opacity = '0';
            setTimeout(() => {
                this.introScreen.classList.add('hidden');
                resolve();
            }, 1000);
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
} 