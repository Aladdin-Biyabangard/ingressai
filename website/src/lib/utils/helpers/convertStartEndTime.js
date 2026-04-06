export const convertStartEndTime = (start, end) => {
    // Validate inputs are strings with sufficient length
    if (typeof start !== 'string' || typeof end !== 'string') {
        return '';
    }
    
    if (start.length < 3 || end.length < 3) {
        return '';
    }
    
    try {
        const startTime = start.slice(0, start.length - 3);
        const endTime = end.slice(0, end.length - 3);
        return `${startTime} - ${endTime}`;
    } catch (error) {
        console.error('Error converting start/end time:', error, { start, end });
        return '';
    }
}