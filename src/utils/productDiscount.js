export function formatCurrency(value) {
    return `₹${Number(value).toFixed(2)}`;
  }
  
  export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }