export const handler = async (event: any): Promise<any> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello from JAWS UG Kyoto DevOps Workshop!',
      timestamp: new Date().toISOString(),
    }),
  };
};
