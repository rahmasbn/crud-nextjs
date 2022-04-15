import styles from "src/commons/styles//Loading.module.css";

function LoadingComp() {
  return (
    <div className={`${styles.loadingWrapper}`}>
      <div className={`${styles.contentSkeleton}`}></div>
      <div className={`mt-5 ${styles.contentSkeleton}`}></div>
    </div>
  );
}

export default LoadingComp;
