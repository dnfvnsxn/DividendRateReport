const convertListToHtml = (htmlMessage, title, list) => {
  htmlMessage = htmlMessage + `<h1>${title}</h1><br/><br/>`;

  list.map((str) => {
    htmlMessage = htmlMessage + `<div>${str}</div><br/>`;
  });

  return htmlMessage;
};

const convertMessage = (portfolioMessage, interestsMessage) => {
  let htmlMessage = "";

  htmlMessage = convertListToHtml(htmlMessage, "Portfolio", portfolioMessage);

  htmlMessage = convertListToHtml(htmlMessage, "Interest", interestsMessage);

  return htmlMessage;
};

export default convertMessage;
