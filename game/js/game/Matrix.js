class Matrix {
    static add(a, b) {
        return a.map((row, i) => row.map((val, j) => val + b[i][j]));
    }

    static subtract(a, b) {
        return a.map((row, i) => row.map((val, j) => val - b[i][j]));
    }

    static multiply(a, b) {
        return a.map((row, i) => 
            Array(b[0].length).fill(0).map((_, j) => 
                row.reduce((sum, val, k) => sum + val * b[k][j], 0)
            )
        );
    }

    static transpose(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]));
    }

    static determinant(matrix) {
        if (matrix.length === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        
        let det = 0;
        for (let i = 0; i < matrix.length; i++) {
            det += Math.pow(-1, i) * matrix[0][i] * 
                  this.determinant(this.minor(matrix, 0, i));
        }
        return det;
    }

    static minor(matrix, row, col) {
        return matrix
            .filter((_, index) => index !== row)
            .map(row => row.filter((_, index) => index !== col));
    }

    static identity(size) {
        return Array(size).fill().map((_, i) => 
            Array(size).fill().map((_, j) => i === j ? 1 : 0)
        );
    }

    static toString(matrix) {
        return matrix.map(row => row.join(' ')).join('\n');
    }

    static to
} 