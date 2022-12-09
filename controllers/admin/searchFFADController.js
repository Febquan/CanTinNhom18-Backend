const FFADModel = require("../../Model/fastFoodAndDrink");

const emailSearch = async (req, res, next) => {
  try {
    const FFADSearch = req.body.search;
    if (!FFADSearch) {
      throw new Error("Bạn chưa nhập gì cả");
    }
    let result = await FFADModel.find();
    result = result.filter((FFAD) =>
      FFAD.name.toLowerCase().includes(FFADSearch.toLowerCase().trim())
    );
    if (result.length == 0) {
      throw new Error("Không tìm thấy sản phẩm này trong kho");
    }
    res.status(200).json({
      content: result,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = emailSearch;
