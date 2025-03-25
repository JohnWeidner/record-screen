import React from "react";

// Components
import Content from "./Content";

import styles from "../../styles/player/_Player.module.scss";

const Player = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Content />
      </div>
    </div>
  );
};

export default Player;
