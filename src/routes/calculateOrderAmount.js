const calculateOrderAmount = (items, amout) => {
    if(Array.isArray(items)) return items.reduce((a, b, i) => a + (b * amout[i]), 0);
    return items;
};

module.exports = calculateOrderAmount