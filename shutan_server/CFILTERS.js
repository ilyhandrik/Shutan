const CFILTERS = {
    LEFT_PLAYER: {
        category: 0b0100,
        mask: 0b0001,
    },
    RIGHT_PLAYER: {
        category: 0b0010,
        mask: 0b1001,
    },
    LEFT_FB: {
        category: 0b1000,
        mask: 0b0011,
    },
    RIGHT_FB: {
        category: 0b0001,
        mask: 0b0101,
    },
    SCENE: {
        category: 0b0001,
        mask: 0b1111,
    },
}

module.exports = CFILTERS;