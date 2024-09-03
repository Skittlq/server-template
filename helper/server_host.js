import "dotenv/config";

const host = () => {
  return process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : `https://${process.env.NEXT_PUBLIC_COMPUTER_DOMAIN}:${process.env.NEXT_PUBLIC_COMPUTER_PORT}`;
};

export default host;
