import styles from "src/commons/styles/Card.module.css";
import defaultImg from "public/default.jpg";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import ProductModal from "./ProductModal";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteProduct } from "src/redux/actions/product";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function CardProduct(props) {
  const { id, name, price, image, stock } = props.data;
  const dispatch = useDispatch();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [idProduct, setIdProduct] = useState("");
  const [priceProduct, setPriceProduct] = useState("");
  const [stockProduct, setStockProduct] = useState("");
  const [imageProduct, setImageProduct] = useState("");
  const [nameProduct, setNameProduct] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShow(false), setIsEdit(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    toast.success("Product deleted successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
    router.push("/");
  };

  const formatPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  })
    .format(price)
    .replace(/(\.|,)00$/g, "");

  return (
    <>
      <summary className={`card border-0 shadow mb-3 rounded-3`}>
        <div className={`${styles.body} d-md-flex`}>
          <div className={`align-self-center d-flex`}>
            <div className={`${styles["wrapper-img"]} me-5`}>
              <Image
                src={
                  image !== null
                    ? require(`public/products/${image}`)
                    : defaultImg
                }
                width={80}
                height={80}
                alt="img"
                layout="responsive"
                className={`${styles["img-product"]}`}
              />
              {/* <Image
                    src={
                      // image !== null
                      //   ? `${process.env.NEXT_PUBLIC_HOST}/uploads/${image}`
                      //   : avatar
                      isError === true
                        ? avatar
                        : `${process.env.NEXT_PUBLIC_HOST}/uploads/${image}`
                    }
                    placeholder="blur"
                    blurDataURL={avatar}
                    onError={() => {
                      setIsError(true);
                    }}
                    width={30}
                    height={30}
                    alt="user"
                    layout="responsive"
                    className={`${styles["img-user"]}`}
                  /> */}
            </div>
            <div className="align-self-center">
              <h4 className="fw-bold">
                {/* {firstName} {lastName} */}
                {name}
              </h4>
              <p className="m-0 fs-5">
                {/* {noTelp !== null ? noTelp : "-"} */}
                {formatPrice}
              </p>
              <p className={`mt-2 text-muted ${styles.stock}`}>
                {/* {noTelp !== null ? noTelp : "-"} */}
                stock : {stock}
              </p>
            </div>
          </div>
          <div className="d-flex ms-auto d-md-block justify-content-center align-self-end mt-2">
            <button
              type="button"
              className={`btn btn-lg ${styles.btnDelete} me-3`}
              onClick={() => setShowModal(true)}
            >
              <small className="p-3">Delete</small>
            </button>
            <button
              type="submit"
              className={`btn btn-lg ${styles.btnEdit}`}
              onClick={() => {
                setIsEdit(true);
                setShow(true);
                setIdProduct(props.data.id);
                setNameProduct(props.data.name);
                setImageProduct(props.data.image);
                setPriceProduct(props.data.price);
                setStockProduct(props.data.stock);
              }}
            >
              <small className="p-3">Edit</small>
            </button>
          </div>
        </div>

        {/* Modal */}
        <ProductModal
          show={show}
          handleClose={handleClose}
          handleEdit={isEdit}
          id={idProduct}
          name={nameProduct}
          price={priceProduct}
          stock={stockProduct}
          image={imageProduct}
        />

        <Modal show={showModal}>
          <Modal.Body>
            <p className={`${styles.text}`}>
              Are you sure you want to delete this product?
            </p>
            <div
              className={`${styles["modal-btn"]} mt-5 d-flex ms-auto align-self-end`}
            >
              <Button
                className={`btn ${styles.delete}`}
                onClick={() => {
                  setShowModal(false);
                  handleDelete(id);
                }}
              >
                Yes
              </Button>
              <Button
                className={`btn ${styles.cancel}`}
                onClick={() => {
                  setShowModal(false);
                }}
              >
                No
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </summary>
    </>
  );
}

export default CardProduct;
