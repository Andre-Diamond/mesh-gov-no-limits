import PlaceholderChart from '../components/PlaceholderChart';
import PlaceholderTable from '../components/PlaceholderTable';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Home.module.css';

export default function Home() {
    const { meshData, catalystData, isLoading, error } = useData();

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Error: {error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.title}>Mesh Governance</h1>
                <p className={styles.description}>Welcome to the Cardano Mesh Governance Dashboard</p>
            </div>

            <div className={styles.content}>
                <PlaceholderChart />
                <PlaceholderTable />
                <div className={styles.dataDisplay}>
                    <h2>Latest Mesh Data</h2>
                    <pre>{JSON.stringify(meshData?.currentStats, null, 2)}</pre>
                    {catalystData && (
                        <>
                            <h2>Latest Catalyst Data</h2>
                            <pre>{JSON.stringify(catalystData.catalystData, null, 2)}</pre>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 