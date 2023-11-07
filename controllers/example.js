const cheerio = require("cheerio");

exports.getFormulaOneDrivers = async (req, res, next) => {
  try {
    // Fetch data from URL and store the response into a const
    const response = await fetch("https://www.formula1.com/en/drivers.html");
    // Convert the response into text
    const body = await response.text();

    // Load body data
    const $ = cheerio.load(body);

    // Create empty array
    const items = [];

    // Selecting Each col-12 class name and iterate through the list
    $(".listing-items--wrapper > .row > .col-12").map((i, el) => {
      // Select rank, points, first name, last name, team and photo
      const rank = $(el).find(".rank").text();
      const points = $(el).find(".points > .f1-wide--s").text();
      const firstName = $(el).find(".listing-item--name span:first").text();
      const lastName = $(el).find(".listing-item--name span:last").text();
      const team = $(el).find(".listing-item--team").text();
      const photo = $(el).find(".listing-item--photo img").attr("data-src");

      // Push the data into the items array
      items.push({
        rank,
        points,
        firstName,
        lastName,
        team,
        photo,
      });
    });

    res.status(200).json({ message: "OK", drivers: items });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    if (!error.codigo) error.codigo = "g100";
    if (!error.message) error.message = "Error interno del servidor";
    next(error);
  }
};
