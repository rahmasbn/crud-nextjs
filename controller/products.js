import { executeQuery } from "config/db";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/products");
  },
  filename: (req, file, cb) => {
    const format = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, format);
  },
});

const multerOptions = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // console.log(file.mimetype);
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      return cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png and .jpg format allowed!");
      err.code = "WRONG_EXTENSION";
      return cb(err);
    }
  },
  limits: { fileSize: 100 * 1024 },
});

const upload = multerOptions.single("productImg");

const getProducts = async (req, res) => {
  try {
    const { query } = req;
    let keyword = "";
    if (query.keyword) keyword = `%${query.keyword}%`;
    let page = parseInt(query.page);
    let limit = parseInt(query.limit);
    let offset = "";
    let statement = [];
    let data = "";

    let productData = "SELECT * FROM products";
    let countData = 'SELECT COUNT(*) AS "count" FROM products';

    // search
    if (keyword) {
      productData += " WHERE name LIKE ?";
      countData += " WHERE name LIKE ?";
      statement.push(keyword);
      data += `&keyword=${query.keyword}`;
    }

    // Paginasi
    const countQuery = await executeQuery(countData, statement);
    const totalData = countQuery[0].count;
    if (!query.page && !query.limit) {
      page = 1;
      limit = 5;
      offset = 0;
      productData += " LIMIT ? OFFSET ?";
      statement.push(limit, offset);
    } else {
      productData += " LIMIT ? OFFSET ?";
      offset = (page - 1) * limit;
      statement.push(limit, offset);
    }
    const meta = {
      totalData,
      totalPage: Math.ceil(totalData / limit),
      next:
        page == Math.ceil(totalData / limit)
          ? null
          : `/products?page=${page + 1}&limit=${limit}` + data,
      page,
      prev:
        page == 1 ? null : `/products?page=${page - 1}&limit=${limit}` + data,
    };

    const sqlQuery = await executeQuery(productData, statement);
    res.status(200).json({
      msg: "List products",
      result: {
        meta,
        data: sqlQuery,
      },
    });
    // res.send(sqlQuery);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const addProduct = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("error", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          errMsg: `Image size mustn't be bigger than 100KB!`,
          err: err.code,
        });
      }
      if (err.code === "WRONG_EXTENSION") {
        return res.status(400).json({
          errMsg: `Only .png and .jpg format allowed!`,
          err: err.code,
        });
      }
      return res.status(500).json({
        errMsg: `Something went wrong.`,
        err,
      });
    }
    const { body, file } = req;
    console.log("req", file);
    let newBody = {};
    if (file) {
      newBody = {
        ...body,
        image: file.filename,
      };
    }
    console.log("new", newBody);
    const name = body.name;
    executeQuery(`SELECT name FROM products WHERE name = ?`, name)
      .then((result) => {
        // console.log("result", result);
        if (result.length >= 1) {
          res.status(400).json({ msg: "Product name is already exist", errCode: 400 });
        } else {
          executeQuery("INSERT INTO products SET ?", newBody)
            .then((result) => {
              res.status(200).json({
                msg: "Data added successfully",
                data: {
                  id: result.insertId,
                  ...newBody,
                },
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
};

const editProductById = (req, res) => {
  const id = req.query.id;
  upload(req, res, (err) => {
    if (err) {
      console.log("error", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          errMsg: `Image size mustn't be bigger than 100KB!`,
          err: err.code,
          errStatus: 404,
        });
      }
      if (err.code === "WRONG_EXTENSION") {
        return res.status(400).json({
          errMsg: `Only .png and .jpg format allowed!`,
          err: err.code,
          errStatus: 404,
        });
      }
      return res.status(500).json({
        errMsg: `Something went wrong.`,
        err,
      });
    }
    const { body, file } = req;
    let newBody = {};
    if (file) {
      newBody = {
        ...body,
        image: file.filename,
      };
    } else {
      newBody = {
        ...body,
      };
    }
    // console.log("edit", newBody);
    const name = body.name;
    if (name) {
      executeQuery(`SELECT name FROM products WHERE name = ?`, name)
        .then((result) => {
          // console.log("result", result);
          if (result.length >= 1) {
            res.status(400).json({ msg: "Product name is already exist", errStatus: 400 });
          } else {
            executeQuery("UPDATE products SET ? WHERE id = ?", [newBody, id])
              .then((result) => {
                if (result.affectedRows == 0) {
                  res.status(404).json({ msg: "Product id is not found.", errStatus: 404 });
                } else {
                  res.status(200).json({
                    msg: "Data updated successfully",
                    data: {
                      id: id,
                      ...newBody,
                    },
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json(err);
              });
          }
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    } else {
      executeQuery("UPDATE products SET ? WHERE id = ?", [newBody, id])
        .then((result) => {
          if (result.affectedRows == 0) {
            res.status(404).json({ msg: "Product id is not found." });
          } else {
            res.status(200).json({
              msg: "Data updated successfully",
              data: {
                id: id,
                ...newBody,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });
};

const deleteProductById = async (req, res) => {
  const id = req.query.id;
  try {
    const data = await executeQuery("DELETE FROM products WHERE id = ?", id);
    res.status(200).json({ msg: "Data deleted successfully", id: id });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getProducts,
  addProduct,
  editProductById,
  deleteProductById,
};
