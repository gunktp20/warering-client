
function canConvertToNumber(str: string | number | undefined) {
    const num = Number(str);
    return !isNaN(num) && isFinite(num);
}

export default canConvertToNumber