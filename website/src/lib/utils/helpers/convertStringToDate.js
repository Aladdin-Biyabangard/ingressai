export const convertStringToDate = (string) =>{
    const date = new Date(string);

const options = { day: "numeric", month: "long", year: "numeric" };
const formatted = date.toLocaleDateString("en", options);

return formatted
}