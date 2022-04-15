import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styles from "src/commons/styles/Home.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import { addProduct, editProduct } from "src/redux/actions/product";
import { toast } from "react-toastify";

function ProductModal(props) {
  const { handleEdit, show, handleClose, id, name, image, price, stock } =
    props;
  // console.log(handleEdit, "isEdit");
  const router = useRouter();
  const dispatch = useDispatch();
  const err = useSelector((state) => state.products.error);
  const [errData, setErrData] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [values, setValues] = useState({
    name: "",
    stock: "",
    price: "",
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const fileSelectedHandler = (e) => {
    // console.log("file", e.target.files[0]);
    const uploaded = e.target.files[0];
    setSelectedFile(e.target.files[0]);
  };

  const validate = () => {
    let errors = {};

    if (!new RegExp(/^[0-9]*$/g).test(values.price)) {
      errors.price = "This field must be filled with numbers ";
    }
    if (!new RegExp(/^[0-9]*$/g).test(values.stock)) {
      errors.stock = "This field must be filled with numbers ";
    }
    if (handleEdit === false) {
      if (
        !values.name ||
        !values.price ||
        !values.stock ||
        selectedFile === null
      ) {
        errors.form = "Please fill the required fields";
      }
    }
    if (handleEdit === true) {
      if (!values.name || !values.price || !values.stock) {
        errors.form = "Please fill the required fields";
      }
    }
    return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setError(validate(values));
    const validateBody = validate(values);
    // console.log("err val", Object.keys(validateBody).length === 0);
    // console.log("err img", Object.keys(err).length);

    const body = new FormData();
    if (selectedFile !== null) {
      body.append("productImg", selectedFile, selectedFile.name);
    }
    body.append("name", e.target.name.value);
    body.append("stock", e.target.stock.value);
    body.append("price", e.target.price.value);

    console.log("body", ...body);
    if (handleEdit === false) {
      let page = router.query.page ? router.query.page : 1;
      let keyword = router.query.keyword ? router.query.keyword : "";
      if (Object.keys(validateBody).length === 0) {
        // setIsSubmit(true);
        dispatch(addProduct(body, page, keyword));

        // if (Object.keys(errData).length === 0) {
        //   toast.success("Data added successfully", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 3000,
        //   });
        // }
        router.push("/");
      }
    } else {
      let page = router.query.page ? router.query.page : 1;
      let keyword = router.query.keyword ? router.query.keyword : "";
      setValues({
        name: name,
        price: price,
        stock,
        stock,
      });

      if (Object.keys(validateBody).length === 0) {
        setValues({
          name: "",
          stock: "",
          price: "",
        });
        setIsSubmit(true);
        dispatch(editProduct(body, id, page, keyword));
        toast.success("Data updated successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        router.push("/");
      }
    }
    console.log("value", values);
  };

  useEffect(() => {
    if(Object.keys(err) !== 0) {
      setErrData(err)
    }
    console.log("err", errData);

    if (Object.keys(error).length === 0 && isSubmit) {
      setErrData(err)
      console.log("isSubmit", isSubmit);
      console.log("useEff error", error);
    }
  }, [error, isSubmit, errData, err]);

  return (
    <>
      <Modal show={show} className={`${styles.modal}`}>
        <Modal.Body className="mx-3">
          <h3 className="fw-bold mt-2 mb-4">
            {handleEdit === false ? "Add Product" : "Edit Product"}
            <p
              className={`btn-close position-absolute ${styles["btn-close"]}`}
              onClick={handleClose}
            ></p>
          </h3>
          <form onSubmit={submitHandler}>
            <label className="mt-3">Name</label>
            {handleEdit === false ? (
              <input
                className="form-control py-2 mt-2"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                autoFocus
              />
            ) : (
              <input
                className="form-control py-2 mt-2"
                type="text"
                name="name"
                defaultValue={name}
                onChange={handleChange}
                autoFocus
              />
            )}
            {err.msg === "Product name is already exist" && (
              <p className={`text-danger ${styles.space} mt-2`}>{err.msg}</p>
            )}
            <label className="mt-3">Price</label>
            {handleEdit === false ? (
              <input
                className="form-control py-2 mt-2"
                type="text"
                name="price"
                value={values.price}
                onChange={handleChange}
              />
            ) : (
              <input
                className="form-control py-2 mt-2"
                type="text"
                name="price"
                defaultValue={price}
                onChange={handleChange}
              />
            )}

            {error.price !== "undefined" && (
              <p className={`text-danger ${styles.space} mt-2`}>
                {error.price}
              </p>
            )}
            <label className="mt-3">Stock</label>
            {handleEdit === false ? (
              <input
                className="form-control py-2 mt-2"
                type="text"
                name="stock"
                value={values.stock}
                onChange={handleChange}
              />
            ) : (
              <input
                className="form-control py-2 mt-2"
                type="text"
                name="stock"
                defaultValue={stock}
                onChange={handleChange}
              />
            )}
            {error.stock && (
              <p className={`text-danger ${styles.space} mt-2`}>
                {error.stock}
              </p>
            )}
            <label className="mt-3">Product Photo</label>
            <input
              className="form-control py-2 mt-2"
              type="file"
              onChange={fileSelectedHandler}
            />
            {err.err === "LIMIT_FILE_SIZE" ? (
              <p className={`text-danger ${styles.space} mt-2`}>{err.errMsg}</p>
            ) : (
              <p className={`text-danger ${styles.space} mt-2`}>{err.errMsg}</p>
            )}
            {error.form && (
              <p
                className={`text-danger text-center fs-5 ${styles.space} mt-4`}
              >
                {error.form}
              </p>
            )}
            <div
              className={`col-md-12 text-center mt-5 mb-2 d-flex justify-conten-end `}
            >
              {handleEdit === false ? (
                <button
                  type="submit"
                  className={`btn text-white ${styles.submit}`}
                >
                  Submit
                </button>
              ) : (
                <button
                  type="submit"
                  className={`btn text-white ${styles.save}`}
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProductModal;
