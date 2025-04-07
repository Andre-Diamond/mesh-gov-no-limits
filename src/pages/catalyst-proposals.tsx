import { GetStaticProps } from 'next';
import fetchData from '../lib/fetchData';
import CatalystProposalsList from '../components/CatalystProposalsList';
import styles from '../styles/Proposals.module.css';

// Simple number formatting function that doesn't rely on locale settings
const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format ADA amount with symbol
const formatAda = (amount: number): string => {
    return `₳${formatNumber(amount)}`;
};

interface ProjectDetails {
    id: number;
    title: string;
    budget: number;
    milestones_qty: number;
    funds_distributed: number;
    project_id: number;
    category: string;
    status: string;
    finished: string;
}

interface Project {
    projectDetails: ProjectDetails;
    milestonesCompleted: number;
}

interface CatalystData {
    timestamp: string;
    projects: Project[];
}

interface Props {
    data: CatalystData;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    try {
        const data = await fetchData('https://raw.githubusercontent.com/Signius/mesh-automations/main/mesh-gov-updates/catalyst-proposals/catalyst-data.json');
        return {
            props: { data }
        };
    } catch (error) {
        console.error('Failed to fetch Catalyst data:', error);
        return {
            props: {
                data: {
                    timestamp: new Date().toISOString(),
                    projects: []
                }
            }
        };
    }
};

export default function CatalystProposals({ data }: Props) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Catalyst Proposals</h1>
            <p className={styles.description}>View and analyze Catalyst proposals here.</p>

            <div className={styles.stats} role="region" aria-label="statistics">
                <div className={styles.stat}>
                    <h3>Total Projects</h3>
                    <p aria-label="Total Projects">{data.projects.length}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Total Budget</h3>
                    <p aria-label="Total Budget">{formatAda(data.projects.reduce((sum, p) => sum + p.projectDetails.budget, 0))}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Completed Projects</h3>
                    <p aria-label="Completed Projects">{data.projects.filter(p => p.projectDetails.status === 'Completed').length}</p>
                </div>
            </div>

            <CatalystProposalsList data={data} />
        </div>
    );
} 