export const getDatTimeUTC = () => {
    const now = new Date();
    
    // Array of month abbreviations
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Extract components in UTC
    const day = String(now.getUTCDate()).padStart(2, "0"); // Two-digit day
    const month = months[now.getUTCMonth()]; // Abbreviated month
    const year = now.getUTCFullYear(); // Four-digit year
    const hours = String(now.getUTCHours()).padStart(2, "0"); // Two-digit hours
    const minutes = String(now.getUTCMinutes()).padStart(2, "0"); // Two-digit minutes
    const seconds = String(now.getUTCSeconds()).padStart(2, "0"); // Two-digit seconds
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds} (UTC)`;
}
