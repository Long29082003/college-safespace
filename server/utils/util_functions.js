//Todo Ask chatgpt to divide the feelings into 6 big categories, then count feelings and put them in respective category
export const sortedCounts = (object) => {
    if (typeof(object) !== "object" || !object) throw new Error("Invalid input");

    const listOfSortedCount = Object.entries(object).sort((a, b) => b[1] - a[1]);
};