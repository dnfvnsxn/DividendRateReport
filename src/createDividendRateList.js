import axios from "axios";

const TIME_SERIES_MONTHLY_ADJUSTED = "TIME_SERIES_MONTHLY_ADJUSTED";
const TIME_SERIES_DAILY = "TIME_SERIES_DAILY";

export const createDividendRateList = async (stockList) => {
  console.log("createDividendRateList -> stockList", stockList);
  let fullMessage = new Array();

  for (let stock of stockList) {
    const message = await delayedLog(stock);

    fullMessage.push(message);
    await delay();
  }
  console.log("Done!");
  return fullMessage;
};

const delayedLog = async (stock) => {
  const { name, symbol } = stock;

  const {
    dividendType,
    totalDividend,
    recentPrice,
    cuttentDividendRate,
    recentDividendMonth,
  } = await dividendRate(symbol);

  const message = `${name}(${symbol}, ${dividendType}(${recentDividendMonth})): ${cuttentDividendRate}%($${recentPrice})`;

  return message;
};

const delay = () => {
  return new Promise((resolve) => setTimeout(resolve, 30000));
};

const createAlphavantageUrl = (timeSeries, symbol) => {
  const BASE_URL_ALPHAADVANTAGE = "https://www.alphavantage.co/query";
  const key = process.env.ALPHAAVANTAGE_KEY;

  const fullUrl = `${BASE_URL_ALPHAADVANTAGE}?function=${timeSeries}&symbol=${symbol}&apikey=${key}`;

  //console.log("createAlphavantageUrl -> fullUrl", fullUrl);
  return fullUrl;
};

const dividendRate = async (symbol) => {
  const monthlyUrl = createAlphavantageUrl(
    TIME_SERIES_MONTHLY_ADJUSTED,
    symbol
  );

  const monthly = await axios
    .get(monthlyUrl)
    .then((res) => {
      return res.data["Monthly Adjusted Time Series"];
    })
    .catch((e) => {
      console.log("error", e);
    });

  const dailyUrl = createAlphavantageUrl(TIME_SERIES_DAILY, symbol);

  const daily = await axios
    .get(dailyUrl)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log("error", e);
    });

  let dateKey = null;
  if (dateKey == null) {
    dateKey = Object.keys(monthly).splice(1, 12);
    //console.log("dividendRate -> monthlyKey", dateKey);
  }

  let dividend = new Array();

  dateKey.map((date) => {
    const price = monthly[date]["7. dividend amount"];

    if (price != "0.0000") {
      const obj = {
        date,
        price,
      };
      dividend.push(obj);
    }
  });
  //console.log("dividendRate -> dividend", dividend);

  let dividendType = null;
  let totalDividend = null;
  const dividendCnt = Object.keys(dividend).length;

  //console.log("dividendRate -> dividendCnt", dividendCnt);

  if (dividendCnt >= 12) {
    dividendType = "monthly";
    totalDividend = parseFloat(dividend[0].price) * 12;
  } else if (dividendCnt >= 4) {
    dividendType = "quarterly";
    totalDividend = parseFloat(dividend[0].price) * 4;
  } else if (dividendCnt >= 2) {
    dividendType = "semi-annually";
    totalDividend = parseFloat(dividend[0].price) * 2;
  } else if (dividendCnt >= 1) {
    dividendType = "annually";
    totalDividend = parseFloat(dividend[0].price);
  } else {
    dividendType = "no-dividend";
  }

  const recentday = daily["Meta Data"]["3. Last Refreshed"];
  const recentPrice = parseFloat(
    daily["Time Series (Daily)"][recentday]["4. close"]
  );

  //console.log("dividendRate -> recentPrice", recentPrice);

  if (dividendType != "no-dividend") {
    const cuttentDividendRate = ((totalDividend / recentPrice) * 100).toFixed(
      2
    );
    //console.log("dividendRate -> cuttentDividendRate", cuttentDividendRate);

    const recentDividendMonth = `${dividend[0].date.split("-")[1]}, ${
      dividend[1].date.split("-")[1]
    }`;

    const result = {
      dividendType,
      totalDividend,
      recentPrice,
      cuttentDividendRate,
      recentDividendMonth,
    };

    return result;
  } else {
    const result = {
      dividendType,
      totalDividend: 0,
      recentPrice,
      cuttentDividendRate: 0,
      recentDividendMonth: "",
    };

    return result;
  }
};
