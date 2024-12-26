class Level {
    constructor() {
        this.currentLevel = 1;
        this.stars = [];
        this.currentMatrix = null;
        this.init();
    }

    init() {
        this.generateMatrix();
        this.generateStars(this.currentLevel);
    }

    generateStars(count = 1) {
        this.stars = [];
        const gameScene = document.querySelector('.game-scene');
        
        if (!gameScene) {
            console.error('Game scene not found');
            return;
        }

        // 清除旧的星星
        const oldStars = gameScene.querySelectorAll('.star');
        oldStars.forEach(star => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        });

        // 获取游戏场景的边界
        const bounds = gameScene.getBoundingClientRect();
        const padding = 100;
        
        // 生成新星星
        const star = document.createElement('div');
        star.className = 'star';
        
        // 确保星星在可见区域内
        const x = padding + Math.random() * (bounds.width - 2 * padding);
        const y = padding + Math.random() * (bounds.height - 2 * padding);
        
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.opacity = '0';
        
        gameScene.appendChild(star);
        
        // 添加出现动画
        requestAnimationFrame(() => {
            star.style.transition = 'opacity 300ms ease-in';
            star.style.opacity = '1';
        });
        
        this.stars.push({
            element: star,
            x: x,
            y: y,
            score: 150
        });
    }

    generateMatrix() {
        // 生成整数特征值 (1到10之间)
        let λ1, λ2;
        do {
            λ1 = Math.floor(Math.random() * 10) + 1;  // 1-10的范围
            λ2 = Math.floor(Math.random() * 10) + 1;  // 1-10的范围
        } while (λ1 === λ2); // 避免重复的特征值

        // 预定义简单的整数特征向量对和对应的矩阵形式
        const vectorPairs = [
            {
                // 标准基向量 - 对角矩阵
                vectors: [[1, 0], [0, 1]],
                getMatrix: () => ([
                    [λ1, 0],
                    [0, λ2]
                ])
            },
            {
                // 上三角矩阵
                vectors: [[1, 0], [1, 1]],
                getMatrix: () => ([
                    [λ1, λ2 - λ1],
                    [0, λ2]
                ])
            },
            {
                // 对称矩阵（只在差值为偶数时使用）
                vectors: [[1, 1], [1, -1]],
                getMatrix: () => {
                    if ((λ1 - λ2) % 2 !== 0) return null;
                    return [
                        [(λ1 + λ2)/2, (λ1 - λ2)/2],
                        [(λ1 - λ2)/2, (λ1 + λ2)/2]
                    ];
                }
            },
            {
                // 简单上三角矩阵
                vectors: [[1, 1], [0, 1]],
                getMatrix: () => ([
                    [λ1, λ2 - λ1],
                    [0, λ2]
                ])
            }
        ];

        // 随机选择一个矩阵形式并验证
        let selected, matrix;
        do {
            selected = vectorPairs[Math.floor(Math.random() * vectorPairs.length)];
            matrix = selected.getMatrix();
            
            // 如果矩阵生成失败，重新选择特征值
            if (!matrix) {
                do {
                    λ1 = Math.floor(Math.random() * 10) + 1;
                    λ2 = Math.floor(Math.random() * 10) + 1;
                } while (λ1 === λ2);
                continue;
            }

            // 验证矩阵元素是否为整数
            const isInteger = (num) => Number.isInteger(num);
            const allIntegers = matrix.every(row => row.every(isInteger));
            if (!allIntegers) continue;

            // 验证特征值和特征向量
            const isValid = this.verifyEigenpair(matrix, [λ1, λ2], selected.vectors);
            if (isValid) break;
        } while (true);

        // 存储当前矩阵信息
        this.currentMatrix = {
            matrix: matrix,
            eigenvalues: [λ1, λ2],
            eigenvectors: selected.vectors
        };

        console.log('Generated matrix:', this.currentMatrix);
        console.log('Eigenvalues:', [λ1, λ2]);
        console.log('Eigenvectors:', selected.vectors);
        
        // 更新显示
        this.updateMatrixDisplay();
    }

    verifyEigenpair(matrix, eigenvalues, eigenvectors) {
        // 验证每个特征值和特征向量对
        for (let i = 0; i < 2; i++) {
            const λ = eigenvalues[i];
            const v = eigenvectors[i];
            
            // 计算 Av
            const Av = [
                matrix[0][0] * v[0] + matrix[0][1] * v[1],
                matrix[1][0] * v[0] + matrix[1][1] * v[1]
            ];
            
            // 计算 λv
            const λv = [λ * v[0], λ * v[1]];
            
            // 检查 Av = λv（使用更严格的误差范围）
            if (Math.abs(Av[0] - λv[0]) > 1e-13 || Math.abs(Av[1] - λv[1]) > 1e-13) {
                return false;
            }
        }
        return true;
    }

    updateMatrixDisplay() {
        const matrixA = document.querySelector('.matrix-A');
        if (matrixA && this.currentMatrix) {
            const cells = matrixA.querySelectorAll('.matrix-cell');
            if (cells.length === 4) {
                cells[0].textContent = this.currentMatrix.matrix[0][0];
                cells[1].textContent = this.currentMatrix.matrix[0][1];
                cells[2].textContent = this.currentMatrix.matrix[1][0];
                cells[3].textContent = this.currentMatrix.matrix[1][1];
            }
        }
    }

    generateLevel(level) {
        this.currentLevel = level;
        this.generateMatrix();
        this.generateStars(level);
        this.updateLevelDisplay();
    }

    updateLevelDisplay() {
        const levelElement = document.querySelector('.level');
        if (levelElement) {
            levelElement.textContent = `第 ${this.currentLevel} 关`;
        }
    }

    clear() {
        // 清除所有星星
        this.stars.forEach(star => {
            if (star.element && star.element.parentNode) {
                star.element.parentNode.removeChild(star.element);
            }
        });
        this.stars = [];
        
        // 重置关卡
        this.currentLevel = 1;
        this.generateMatrix();
        this.generateStars(this.currentLevel);
    }

    getLevelTimeLimit() {
        // 每关都返回60秒
        return 60;
    }

    checkAnswer(inputEigenvalues, inputEigenvectors) {
        const { eigenvalues, eigenvectors } = this.currentMatrix;
        
        // 对输入的特征值排序
        const sortedInput = [...inputEigenvalues].sort((a, b) => a - b);
        const sortedExpected = [...eigenvalues].sort((a, b) => a - b);
        
        // 检查特征值
        if (Math.abs(sortedInput[0] - sortedExpected[0]) > 1e-10 || 
            Math.abs(sortedInput[1] - sortedExpected[1]) > 1e-10) {
            return false;
        }
        
        // 检查特征向量
        for (let i = 0; i < 2; i++) {
            const v = inputEigenvectors[i];
            const λ = inputEigenvalues[i];
            
            // 计算 Av
            const Av = [
                this.currentMatrix.matrix[0][0] * v[0] + this.currentMatrix.matrix[0][1] * v[1],
                this.currentMatrix.matrix[1][0] * v[0] + this.currentMatrix.matrix[1][1] * v[1]
            ];
            
            // 计算 λv
            const λv = [λ * v[0], λ * v[1]];
            
            // 检查 Av = λv
            if (Math.abs(Av[0] - λv[0]) > 1e-10 || Math.abs(Av[1] - λv[1]) > 1e-10) {
                return false;
            }
        }
        
        return true;
    }
} 
