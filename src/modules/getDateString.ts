export default function getDateString(){
    // export a date string in the format of "May 1, 2021 hh:mm:ss AM"
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return `${month} ${day}, ${year} ${hour12}:${minute} ${ampm}`;

}