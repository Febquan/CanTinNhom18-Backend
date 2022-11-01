exports.getPost = (req, res, next) => {
  res.status(200).json({
    content: "xin chao ",
    ar: [1, 2, 3, 4],
  });
};
