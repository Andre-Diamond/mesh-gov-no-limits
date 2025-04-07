import { GetStaticProps } from 'next';
import MeshStatsView from '../components/MeshStatsView';
import fetchData from '../lib/fetchData';
import styles from '../styles/MeshStats.module.css';

interface MeshStatsPageProps {
    currentStats: any;
    stats2024: any;
    stats2025: any;
    error?: string;
}

export const getStaticProps: GetStaticProps<MeshStatsPageProps> = async () => {
    try {
        const [currentStats, stats2024, stats2025] = await Promise.all([
            fetchData('https://raw.githubusercontent.com/Signius/mesh-automations/main/mesh-gov-updates/mesh-stats/mesh_stats.json'),
            fetchData('https://raw.githubusercontent.com/Signius/mesh-automations/main/mesh-gov-updates/mesh-stats/mesh-yearly-stats-2024.json'),
            fetchData('https://raw.githubusercontent.com/Signius/mesh-automations/main/mesh-gov-updates/mesh-stats/mesh-yearly-stats-2025.json')
        ]);

        return {
            props: {
                currentStats,
                stats2024,
                stats2025
            },
            revalidate: 60 * 60 * 24 // Revalidate daily
        };
    } catch (error) {
        console.error('Error fetching mesh stats:', error);
        return {
            props: {
                currentStats: null,
                stats2024: null,
                stats2025: null,
                error: 'Failed to load mesh statistics'
            },
            revalidate: 60 * 60 // Retry every hour if there was an error
        };
    }
};

export default function MeshStatsPage({ currentStats, stats2024, stats2025, error }: MeshStatsPageProps) {
    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.stat}>
                    <p className={styles.error}>{error}</p>
                </div>
            </div>
        );
    }

    if (!currentStats || !stats2024 || !stats2025) {
        return (
            <div className={styles.container}>
                <div className={styles.stat}>
                    <p>Loading mesh statistics...</p>
                </div>
            </div>
        );
    }

    return <MeshStatsView currentStats={currentStats} stats2024={stats2024} stats2025={stats2025} />;
} 