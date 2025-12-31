export const calculatePercentage = (
    numerator,
    denominator1,
    ofLabel1,
    denominator2,
    ofLabel2
) => {

    const calc = (num, denom) => {
        if (!denom || num > denom) return "N/A";

        const percent = (num / denom) * 100;
        const decimals = percent >= 10 ? 1 : 2;

        return `${percent.toFixed(decimals)}%`;
    };

    const percent1 = calc(numerator, denominator1);
    const percent2 = calc(numerator, denominator2);

    return {
        percentage1: percent1,
        label1: percent1 !== "N/A" ? `of ${ofLabel1}` : "",
        percentage2: percent2 !== "N/A" ? percent2 : "",
        label2: percent2 !== "N/A" ? `of ${ofLabel2}` : "",
    };
};
