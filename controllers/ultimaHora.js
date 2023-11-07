const cheerio = require("cheerio");
const { validationResult } = require("express-validator");
const { imageToBase, getExtensionFile } = require("../utils/imageToBase");

exports.getNoticiasByQuery = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let currentError = errors.errors[0];
      const error = `${currentError.msg}`;
      error.statusCode = 400;
      error.codigo = "g268";
      res
        .status(statusCode)
        .json({ error: error.message, codigo: error.codigo });
      return;
    }

    const query = req.query.q;

    const isReturnPhoto = req.query.f;

    const response = await fetch(
      `https://www.ultimahora.com/buscador?q=${query}#nt=navsearch`
    );

    const body = await response.text();

    const $ = cheerio.load(body);

    const items = [];

    const content = $(
      "body > div.SearchResultsPage-content > bsp-search-results-module > form > div.SearchResultsModule-ajax > div > div"
    ).text();

    if (content.search("No") >= 0) {
      const error = new Error(
        `No se encuentran noticias para el texto: ${query}`
      );
      error.statusCode = 404;
      error.codigo = "g267";
      throw error;
    }

    $(
      "body > div.SearchResultsPage-content > bsp-search-results-module > form > div.SearchResultsModule-ajax > div > bsp-search-filters > div > main > ul.SearchResultsModule-results"
    ).map((i, el) => {
      let titulo, fecha, enlace, imagen, resumen, currentFormated;
      for (let i = 1; i <= 5; i++) {
        titulo = $(el)
          .find(
            `li:nth-child(${i}) > div > div.PagePromo-content > div.PagePromo-title > a`
          )
          .text();

        fecha = $(el)
          .find(
            `li:nth-child(${i}) > div > div.PagePromo-content > div.PagePromo-byline > div`
          )
          .text();

        resumen = $(el)
          .find(
            `li:nth-child(${i}) > div > div.PagePromo-content > div.PagePromo-description`
          )
          .text();

        enlace = $(el)
          .find(`li:nth-child(${i}) > div > div.PagePromo-media > a`)
          .attr("href");

        imagen = $(el)
          .find(`div > div.PagePromo-media > a > picture > img`)
          .attr("src");

        imageToBase(imagen).then((base64String) => {
          currentFormated = base64String;
        });

        let currentItem = {
          fecha: fecha,
          enlace: enlace,
          enlace_foto: imagen,
          imagenTobase64: currentFormated,
          titulo: titulo,
          resumen: resumen ? resumen : null,
        };

        items.push(currentItem);
      }
    });

    if (isReturnPhoto) {
      let currentFormated, currentObject, currentFileExtension;

      for (let i = 0; i < items.length; i++) {
        currentObject = items[i];
        currentFileExtension = getExtensionFile(currentObject.enlace_foto);
        currentFormated = await imageToBase(currentObject.enlace_foto);
        items[i].contenido_foto = currentFormated;
        items[i].content_type_foto = currentFileExtension;
      }
    }

    res.status(200).json({ message: "OK", noticias: items });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    if (!error.codigo) error.codigo = "g100";
    if (!error.message) error.message = "Error interno del servidor";
    next(error);
  }
};
