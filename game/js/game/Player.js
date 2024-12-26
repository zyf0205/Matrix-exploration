class Player {
    constructor(gameScene) {
        this.element = document.createElement('div');
        this.element.className = 'player';
        this.gameScene = gameScene;
        this.size = 50;
        this.isMoving = false;
        
        // 设置初始样式
        this.element.style.position = 'absolute';
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        
        // 初始化位置
        const bounds = gameScene.getBoundingClientRect();
        this.x = bounds.width / 2 - this.size / 2;
        this.y = bounds.height / 2 - this.size / 2;
        
        // 直接设置初始位置
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = '1';
        
        this.gameScene.appendChild(this.element);
    }

    moveTo(targetX, targetY, callback) {
        if (this.isMoving) return;
        this.isMoving = true;

        // 设置过渡效果，包括透明度
        this.element.style.transition = 'left 500ms ease-in-out, top 500ms ease-in-out, opacity 500ms ease-in-out';
        
        // 先淡出
        this.element.style.opacity = '0';
        
        // 等待淡出完成后移动位置
        setTimeout(() => {
            // 更新位置
            this.x = targetX;
            this.y = targetY;
            this.element.style.left = `${targetX}px`;
            this.element.style.top = `${targetY}px`;
            
            // 立即淡入
            this.element.style.opacity = '1';
            
            // 动画完成后清理
            setTimeout(() => {
                this.element.style.transition = '';
                this.isMoving = false;
                if (callback) callback();
            }, 500);
        }, 500);
    }

    reset() {
        this.isMoving = false;
        this.element.style.transition = '';
        
        const bounds = this.gameScene.getBoundingClientRect();
        this.x = bounds.width / 2 - this.size / 2;
        this.y = bounds.height / 2 - this.size / 2;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = '1';
    }
} 