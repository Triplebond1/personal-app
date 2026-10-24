export function getErrorMessage(error: unknown, message: string) {
  return error instanceof Error
    ? error.message
    : message;
}


export function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}


export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function splitIds(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function calculateReadTime(content: string): number {
  if (content.trim() === "") {
    return 0;
  } 
    const words = content.trim().split(/\s+/).length;

    return Math.ceil(words / 200);
  
}