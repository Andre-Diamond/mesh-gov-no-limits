import React from 'react';
import styles from '../styles/Home.module.css';

const PlaceholderTable: React.FC = () => {
    return (
        <div className={styles.tableContainer}>
            <h2>Governance Statistics</h2>
            <div className={styles.placeholder}>
                <p>Table data will be displayed here</p>
            </div>
        </div>
    );
};

export default PlaceholderTable; 