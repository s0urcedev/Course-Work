export function calculateLevels(numberOfQuestionsForStudent) {
    let levels = [numberOfQuestionsForStudent];
    let currentIndex = 0;
    while (!levels.includes(1)) {
        let currentLength = levels.length;
        for (; currentIndex < currentLength; currentIndex ++) {
            levels.push(levels[currentIndex] - 1);
        }
        levels.push(levels[currentIndex - 1] + 1);
    }
    return levels.sort(function(a, b) { return a - b; });
}

export function calculateLevelsIndexes(levelsOfQuestions) {
    let levelsIndexes = [0, 0];
    for (let i = 1; i < levelsOfQuestions.length; i ++) {
        if (levelsOfQuestions[i] !== levelsOfQuestions[i - 1]) levelsIndexes.push(i);
    }
    return levelsIndexes;
}