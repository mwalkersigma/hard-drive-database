export function parseDateFromXML(dateTime:string) {
    try {
        dateTime = dateTime.trim();
        const [date, time] = dateTime.split(" ");
        const [DD, MM, YYYY] = date.split("/");
        const [h, m, s] = time.split(":");
        let output =  new Date(+YYYY, +MM - 1, +DD, +h, +m, +s);
        if(output.toString() === "Invalid Date"){
            new Error("Invalid date format");
        }
        return output;
    }
    catch (e) {
        // should throw error invalid date format
        throw new Error("Invalid date format");
    }
}