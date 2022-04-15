import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CardProduct from "src/commons/components/cardProduct";
import LoadingComp from "src/commons/components/LoadingComp";
import { loadProducts } from "src/redux/actions/product";
import ProductModal from "src/commons/components/ProductModal";
import styles from "src/commons/styles/Home.module.css";

const showProducts = (data) => {
  const card = [];
  for (let i = 0; i < data.length; i++) {
    const element = <CardProduct data={data[i]} key={i} />;
    card.push(element);
  }
  return card;
};

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector((state) => state.products.dataProducts);
  // console.log("data", products);
  const loading = useSelector((state) => state.products.loading);
  // console.log("loading", loading)
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShow(false), setIsEdit(false);
  };

  const handleChange = (e) => {
    let keyword = e.target.value.trim();

    dispatch(loadProducts(1, keyword));
    router.push({
      pathname: "/products",
      query: {
        page: 1,
        keyword: keyword,
      },
    });
  };

  const debounce = (func, delay) => {
    let timeOutId;
    return (...args) => {
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
      timeOutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  useEffect(() => {
    let page = router.query.page ? router.query.page : 1;
    let keyword = router.query.keyword ? router.query.keyword : "";

    dispatch(loadProducts(page, keyword));
  }, [dispatch, router]);

  const pagination = (data) => {
    let keyword = router.query.keyword ? router.query.keyword : "";
    const { page, totalPage } = data;
    // console.log('data paginasi', data)

    return (
      <div className={`d-flex justify-content-center`}>
        {page === 1 ? (
          <>
            <button
              className={`btn fw-bold me-3 px-4 py-2 ${styles["btn-disable"]}`}
            >
              Prev
            </button>
            <p className={`fw-bold ${styles.page}`}>{page}</p>
          </>
        ) : (
          <>
            <Link
              href={`/products?page=${page - 1}&keyword=${keyword}`}
              passHref
            >
              <button className={`btn me-3 px-4 py-2 ${styles["btn-active"]}`}>
                Prev
              </button>
            </Link>
            <p className={`fw-bold ${styles.page}`}>{page}</p>
          </>
        )}
        {page < totalPage ? (
          <Link href={`/products?page=${page + 1}&keyword=${keyword}`} passHref>
            <button className={`btn ms-3 px-4 py-2 ${styles["btn-active"]}`}>
              Next
            </button>
          </Link>
        ) : (
          <button
            className={`btn ms-3 fw-bold px-4 py-2 ${styles["btn-disable"]}`}
          >
            Next
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.card}`}>
      <div className="container">
        <div className="d-flex mt-5 mb-2 justify-content-end">
          <input
            placeholder="Search"
            type="text"
            className={`${styles.search} me-5`}
            onChange={debounce(handleChange, 1000)}
            onKeyPress={(e) => e.key === "Enter" && handleChange}
            autoComplete="off"
            name="keyword"
          />
          <button
            className={`btn ${styles.btnAdd}`}
            onClick={() => {
              setIsEdit(false);
              setShow(true);
            }}
          >
            Add Product
          </button>
        </div>
        {loading === false ? (
          <>
            {products.data && products.data.length > 0 ? (
              <>
                <div className="py-3 col">{showProducts(products.data)}</div>
                <div className="col mt-3 mb-5">{pagination(products.meta)}</div>
              </>
            ) : (
              <h5 className="text-center text-muted mt-5">
                We can&apos;t find anything you&apos;re looking for.
              </h5>
            )}
          </>
        ) : (
          <LoadingComp />
        )}
      </div>

      {/* Modal */}
      <ProductModal show={show} handleClose={handleClose} handleEdit={isEdit} />
    </div>
  );
}
