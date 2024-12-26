class MathUtils {
    static roundToDecimal(number, decimals = 4) {
        const factor = Math.pow(10, decimals);
        return Math.round(number * factor) / factor;
    }

    static compareFloats(a, b, epsilon = 0.0001) {
        return Math.abs(a - b) < epsilon;
    }

    static solveQuadratic(a, b, c) {
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);
            return [
                {real: realPart, imag: imagPart},
                {real: realPart, imag: -imagPart}
            ];
        }
        const sqrtDisc = Math.sqrt(discriminant);
        return [
            (-b + sqrtDisc) / (2 * a),
            (-b - sqrtDisc) / (2 * a)
        ];
    }
} 