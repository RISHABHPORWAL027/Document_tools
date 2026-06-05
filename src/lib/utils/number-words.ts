/**
 * Converts a number to Indian currency words format (Rupees and Paise).
 * Follows the Indian numbering system (Lakhs, Crores, etc.).
 */
export function numberToIndianWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";

  // Split into integer and decimal parts
  const parts = num.toFixed(2).split(".");
  const rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);

  let result = "";

  if (rupees > 0) {
    result += convertIntegerToWords(rupees) + " Rupees";
  }

  if (paise > 0) {
    if (rupees > 0) {
      result += " and ";
    }
    result += convertIntegerToWords(paise) + " Paise";
  }

  return result ? `${result} Only` : "Zero Rupees Only";
}

function convertIntegerToWords(n: number): string {
  const singleDigits = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const doubleDigits = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  if (n === 0) return "";

  if (n < 20) {
    return singleDigits[n];
  }

  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return doubleDigits[tens] + (ones ? " " + singleDigits[ones] : "");
  }

  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    return singleDigits[hundreds] + " Hundred" + (remainder ? " " + convertIntegerToWords(remainder) : "");
  }

  if (n < 100000) {
    const thousands = Math.floor(n / 1000);
    const remainder = n % 1000;
    return convertIntegerToWords(thousands) + " Thousand" + (remainder ? " " + convertIntegerToWords(remainder) : "");
  }

  if (n < 10000000) {
    const lakhs = Math.floor(n / 100000);
    const remainder = n % 100000;
    return convertIntegerToWords(lakhs) + " Lakh" + (remainder ? " " + convertIntegerToWords(remainder) : "");
  }

  // Crores and above
  const crores = Math.floor(n / 10000000);
  const remainder = n % 10000000;
  return convertIntegerToWords(crores) + " Crore" + (remainder ? " " + convertIntegerToWords(remainder) : "");
}
