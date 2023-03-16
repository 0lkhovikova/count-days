import {TimePeriod} from "../../../types/common";

export const checkPeriods = (leavePeriods: TimePeriod[]) => {
    const errorIndexes: number[] = [];

    for (let i = 0; i < leavePeriods.length; ++i) {
        const [start1, end1] = leavePeriods[i];

        if (start1 === null && end1 !== null || start1 !== null && end1 === null) {
            errorIndexes.push(i)
            break;
        }

        if (start1 === null && end1 === null) {
            break;
        }

        for (let j = i + 1; j < leavePeriods.length; ++j) {
            const [start2, end2] = leavePeriods[j];

            if (start2 === null || end2 === null || start1 === null || end1 === null) {
                break;
            }

            if (start1.diff(end2) < 0 && start2.diff(end1) < 0) {
                errorIndexes.push(i, j)
            }
        }
    }


    return errorIndexes
}
