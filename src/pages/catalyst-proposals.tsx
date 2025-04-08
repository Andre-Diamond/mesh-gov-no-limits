import CatalystProposalsList from '../components/CatalystProposalsList';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Proposals.module.css';
import PageHeader from '../components/PageHeader';

// Simple number formatting function that doesn't rely on locale settings
const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format ADA amount with symbol
const formatAda = (amount: number): string => {
    return `₳${formatNumber(amount)}`;
};

interface Project {
    projectDetails: {
        id: number;
        title: string;
        budget: number;
        milestones_qty: number;
        funds_distributed: number;
        project_id: number;
        category: string;
        status: string;
        finished: string;
    };
    milestonesCompleted: number;
}

interface CatalystData {
    timestamp: string;
    projects: Project[];
}

export default function CatalystProposals() {
    const { catalystData, isLoading, error } = useData();

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading catalyst data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    if (!catalystData?.catalystData) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>No catalyst data available</div>
            </div>
        );
    }

    const data = catalystData.catalystData;

    return (
        <div className={styles.container}>
            <PageHeader
                title={<>Catalyst Proposal <span>Dashboard</span></>}
                subtitle="View and analyze Catalyst proposals here."
            />

            <div className={styles.stats} role="region" aria-label="statistics">
                <div className={styles.stat}>
                    <h3>Total Projects</h3>
                    <p aria-label="Total Projects">{data.projects.length}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Total Budget</h3>
                    <p aria-label="Total Budget">{formatAda(data.projects.reduce((sum: number, p: Project) => sum + p.projectDetails.budget, 0))}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Completed Projects</h3>
                    <p aria-label="Completed Projects">{data.projects.filter((p: Project) => p.projectDetails.status === 'Completed').length}</p>
                </div>
            </div>

            <CatalystProposalsList data={data} />
        </div>
    );
} 