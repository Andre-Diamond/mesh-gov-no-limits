import React from 'react';
import styles from '../styles/Home.module.css';

const PlaceholderChart: React.FC = () => {
    return (
        <div className={styles.chartContainer}>
            <h2>Mesh Ecosystem Overview</h2>
            <div className={styles.placeholder}>
                <p>Chart visualization will be displayed here</p>
            </div>
        </div>
    );
};

export default PlaceholderChart; 