const endpoint = {
  dbURL: process.env.NEXT_PUBLIC_API_DB_URL || '', // Provide a fallback in case the variable is missing
};

export default endpoint;
