const isValidQuery = (query: string, keywords: RegExp) => {

    const statements = (query.match(keywords) || []).length;

    if (statements === 0) {
        throw new Error('No valid SQL statements found in the query.');
    } else if (statements > 1) {
        throw new Error('Only single statements are allowed');
    }
}

export { isValidQuery };
