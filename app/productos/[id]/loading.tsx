import styles from "./loading.module.css";

export default function ProductLoading() {
  return (
    <div className="container">
      <span className={styles.skeletonBack} />
      <div className={styles.layout}>
        <div className={styles.skeletonGallery}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonThumbs}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.skeletonInfo}>
          <span className={styles.skeletonTag} />
          <span className={styles.skeletonTagShort} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonTitleShort} />
          <span className={styles.skeletonPrice} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonTextShort} />
          <span className={styles.skeletonButton} />
        </div>
      </div>
    </div>
  );
}
