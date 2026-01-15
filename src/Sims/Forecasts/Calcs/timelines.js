import { TIMELINE_OPTIONS } from "../configs/options-configs";

function getTimelineDate(option) {
    const today = new Date();
    const pastDate = new Date(today); // copy date
    switch (option) {
        case '10 years':
            pastDate.setFullYear(today.getFullYear() - 10);
            break;
        case '5 years':
            pastDate.setFullYear(today.getFullYear() - 5);
            break;
        case '2 years':
            pastDate.setFullYear(today.getFullYear() - 2);
            break;
        case '1 year':
            pastDate.setFullYear(today.getFullYear() - 1);
            break;
        case '6 months':
            pastDate.setMonth(today.getMonth() - 6);
            break;
        case '3 months':
            pastDate.setMonth(today.getMonth() - 3);
            break;
        default:
            throw new Error(`Unknown timeline option: ${option}`);
    }
    return pastDate;
}

export function getPastTimelineDates(startDate) {
    console.log("-----IN GETPASTTIMELINEDATES-----");
    console.log("startDate passed: ", startDate);
    // const effStartDate = new Date(startDate);
    const pastTimelineDates = [{ name: 'All Time', date: startDate }];

    for (let option of TIMELINE_OPTIONS) {
        const timelineDate = getTimelineDate(option);
        if (timelineDate.getTime() >= new Date(startDate).getTime()) {
            pastTimelineDates.push({ name: option, date: timelineDate.toISOString() });
        }
    }

    // Optional: add `null` at the end
    pastTimelineDates.push({ name: null, date: null });

    // console.log("returning pastTimelineDates: ", pastTimelineDates);
    return pastTimelineDates;
}

export function getFutureTimelineDates(pastTimelineDates) {
    console.log("-----IN GETFUTURETIMELINEDATES-----");
    const today = new Date();
    const futureTimelineDates = pastTimelineDates
        .filter(p => p.name !== null) // skip "All Time" and null
        .map(p => {
            const distance = today.getTime() - new Date(p.date).getTime(); // milliseconds
            const futureDate = new Date(today.getTime() + distance);
            // console.log("about to add name: ", p.name, " and futureDate: ", futureDate);
            return { name: p.name, date: futureDate.toISOString() };
        });

    futureTimelineDates.reverse();

    // Optional: add null at start
    futureTimelineDates.unshift({ name: null, date: null });

    return futureTimelineDates;
}
