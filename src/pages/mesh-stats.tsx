import MeshStatsView from '../components/MeshStatsView';
import { useData } from '../contexts/DataContext';
import styles from '../styles/MeshStats.module.css';

export default function MeshStatsPage() {
    const { meshData, isLoading, error } = useData();

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.stat}>
                    <p>Loading mesh statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.stat}>
                    <p className={styles.error}>{error}</p>
                </div>
            </div>
        );
    }

    if (!meshData?.currentStats || !meshData?.yearlyStats || Object.keys(meshData.yearlyStats).length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.stat}>
                    <p>No mesh statistics available</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <MeshStatsView currentStats={meshData.currentStats} yearlyStats={meshData.yearlyStats} />
        </div>
    );
} 