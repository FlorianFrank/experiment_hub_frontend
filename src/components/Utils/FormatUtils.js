/**
 * Formats a field name by cleaning up malformed abbreviations and extra spaces.
 * example: "T C E O E" -> "TCEOE"
 * example: "Multiple   Spaces" -> "Multiple Spaces"
 * 
 * @param {string} name - The field name to format
 * @returns {string} - The formatted field name
 */
export const formatFieldName = (name) => {
    if (!name) return "";
    
    let cleaned = name.replace(/(\b[a-zA-Z])\s+(?=[a-zA-Z]\b)/g, '$1');
    
    return cleaned.replace(/\s+/g, ' ').trim();
};
