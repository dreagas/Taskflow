function formatTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function logSystemEvent(context, message, level = 'INFO') {
    const timestamp = formatTimestamp();
    const formattedMessage = `[${level}] [${timestamp}] [${context}]: ${message}`;

    if (level === 'ERROR') {
        console.error(formattedMessage);
    } else if (level === 'WARN') {
        console.warn(formattedMessage);
    } else {
        console.log(formattedMessage);
    }
}

module.exports = {
    logSystemEvent
};
