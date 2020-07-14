// [ 0, 4,  8, 12,
//   1, 5,  9, 13,
//   2, 6, 10, 14,
//   3, 7, 11, 15]

// in code a matrix may be typed out as:

// [1, 0, 0, 0,
//  0, 1, 0, 0,
//  0, 0, 1, 0,
//  x, y, z, 0]

class myMatrix4x4 
{
    constructor() 
    {
        this.matrix = new Float32Array([1, 0, 0, 0,
                                        0, 1, 0, 0,
                                        0, 0, 1, 0,
                                        0, 0, 0, 1]);

        this.myHardcodedInverse = new Float32Array([Math.sqrt(2) / 2,  Math.sqrt(6) / 6, -Math.sqrt(3) / 3, 0,
                                                    0,                -Math.sqrt(6) / 3, -Math.sqrt(3) / 3, 0,
                                                   -Math.sqrt(2) / 2,  Math.sqrt(6) / 6, -Math.sqrt(3) / 3, 0,
                                                    0,                 0,                 0,                1,]);
    }
    translate(vec3)
    {
        //translate(MatrixToSaveAs, matrixToTranslate, TranslationVector)
        this.matrix = new Float32Array([0.5, 0, 0, 0,
                                        0, 0.5, 0, 0,
                                        0, 0, 0.5, 0,
                                        vec3[0], vec3[1], vec3[2], 1]);
    }
}

