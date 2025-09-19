/**
 * Format currency in Indian Rupee format
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the ₹ symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, includeSymbol: boolean = true): string {
  // Handle invalid inputs
  if (typeof amount !== 'number' || isNaN(amount)) {
    return includeSymbol ? '₹0' : '0';
  }

  // Format number with Indian numbering system (lakhs and crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);
  
  if (!includeSymbol) {
    // Remove the ₹ symbol and any leading/trailing whitespace
    return formatted.replace('₹', '').trim();
  }

  return formatted;
}

/**
 * Format currency for display with custom options
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrencyDisplay(
  amount: number,
  options?: {
    showDecimals?: boolean;
    showSymbol?: boolean;
    compact?: boolean;
  }
): string {
  const {
    showDecimals = false,
    showSymbol = true,
    compact = false,
  } = options || {};

  if (typeof amount !== 'number' || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }

  // For compact notation (K, L, Cr)
  if (compact) {
    if (amount >= 10000000) { // 1 Crore
      const crores = amount / 10000000;
      const formatted = crores.toFixed(crores >= 10 ? 0 : 1);
      return `${showSymbol ? '₹' : ''}${formatted}Cr`;
    } else if (amount >= 100000) { // 1 Lakh
      const lakhs = amount / 100000;
      const formatted = lakhs.toFixed(lakhs >= 10 ? 0 : 1);
      return `${showSymbol ? '₹' : ''}${formatted}L`;
    } else if (amount >= 1000) { // 1 Thousand
      const thousands = amount / 1000;
      const formatted = thousands.toFixed(thousands >= 10 ? 0 : 1);
      return `${showSymbol ? '₹' : ''}${formatted}K`;
    }
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 2,
  });

  return formatter.format(amount);
}

/**
 * Parse currency string to number
 * @param currencyString - String representation of currency
 * @returns Parsed number or 0 if invalid
 */
export function parseCurrency(currencyString: string): number {
  if (!currencyString || typeof currencyString !== 'string') {
    return 0;
  }

  // Remove currency symbols, commas, and whitespace
  const cleanString = currencyString
    .replace(/₹|Rs\.?|INR/gi, '')
    .replace(/,/g, '')
    .trim();

  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Convert paisa to rupees
 * @param paisa - Amount in paisa (1 rupee = 100 paisa)
 * @returns Amount in rupees
 */
export function paisaToRupees(paisa: number): number {
  return paisa / 100;
}

/**
 * Convert rupees to paisa
 * @param rupees - Amount in rupees
 * @returns Amount in paisa
 */
export function rupeesToPaisa(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Format price range
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice);
  }
  return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param currentPrice - Current/discounted price
 * @returns Discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0 || currentPrice < 0) {
    return 0;
  }
  
  if (currentPrice >= originalPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Format discount display
 * @param originalPrice - Original price
 * @param currentPrice - Current price
 * @returns Formatted discount string
 */
export function formatDiscount(originalPrice: number, currentPrice: number): string {
  const discountPercent = calculateDiscountPercentage(originalPrice, currentPrice);
  const discountAmount = originalPrice - currentPrice;
  
  if (discountPercent === 0) {
    return '';
  }
  
  return `Save ${formatCurrency(discountAmount)} (${discountPercent}% off)`;
}
