import axios from "axios";

export const sendStockDividendReportEmail = async (Message) => {
  const today = new Date();

  var postData = {
    personalizations: [
      {
        to: [{ email: "dnfvnsxn@kakao.com", name: "JuHyun Yu" }],
        subject: `Stock Dividend Report[${today.toLocaleDateString()}]`,
      },
    ],
    content: [{ type: "text/html", value: Message }],
    from: { email: "dnfvnsxn@naver.com", name: "JuHyun Yu" },
    reply_to: { email: "dnfvnsxn@naver.com", name: "JuHyun Yu" },
  };

  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${process.env.SNEDGRID_KEY}`,
      "content-type": "application/json",
    },
  };

  return await axios
    .post("https://api.sendgrid.com/v3/mail/send", postData, axiosConfig)
    .then((res) => {})
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    });
};
