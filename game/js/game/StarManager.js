class StarManager {
    constructor(gameScene) {
        this.gameScene = gameScene;
    }

    generateStarPosition() {
        const bounds = this.gameScene.getBoundingClientRect();
        const padding = 100; // 增加边界安全距离

        // 计算可用区域
        const minX = padding;
        const maxX = bounds.width - padding;
        const minY = padding;
        const maxY = bounds.height - padding;

        // 生成随机位置
        const x = Math.random() * (maxX - minX) + minX;
        const y = Math.random() * (maxY - minY) + minY;

        console.log('Generated star position:', x, y); // 调试日志

        return {
            x: x,
            y: y
        };
    }

    createStar(value) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 生成位置
        const position = this.generateStarPosition();
        
        // 设置星星位置
        star.style.position = 'absolute';
        star.style.left = `${position.x}px`;
        star.style.top = `${position.y}px`;
        
        // 添加分值显示
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'star-value';
        valueDisplay.textContent = value;
        star.appendChild(valueDisplay);
        
        // 添加到游戏场景
        this.gameScene.appendChild(star);
        
        return {
            element: star,
            x: position.x,
            y: position.y,
            value: value,
            collected: false
        };
    }
} 