import { portfolio, interests } from "./config/stockList";
import { createDividendRateList } from "./src/createDividendRateList";
import { sendStockDividendReportEmail } from "./src/sendEmail";
import convertMessage from "./src/convertMessage";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, ".env") });

const portfolioMessageSend = async () => {
  const portfolioMessage = await createDividendRateList(portfolio);
  console.log("portfolioMessageSend -> portfolioMessage", portfolioMessage);

  const interestsMessage = await createDividendRateList(interests);
  console.log("portfolioMessageSend -> interestsMessage", interestsMessage);

  const MessageTemplate = convertMessage(portfolioMessage, interestsMessage);

  sendStockDividendReportEmail(MessageTemplate);
};

portfolioMessageSend();
