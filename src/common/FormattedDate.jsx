// components/FormattedDate.js
const FormattedDate = ({ date, format = "default" }) => {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "Invalid date";

  const options =
    format === "short"
      ? { year: "2-digit", month: "short", day: "numeric" }
      : { year: "numeric", month: "long", day: "numeric" };

  return <span>{parsedDate.toLocaleDateString(undefined, options)}</span>;
};

export default FormattedDate;
