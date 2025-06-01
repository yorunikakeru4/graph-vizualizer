import React from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Welcome!</h1>
    <div className={styles.menu}>
      <Link href="/graph-visualizer" className={styles.menuItem}>
        Визуализация графов
      </Link> 
    </div>
  </div>
);

export default Home;
