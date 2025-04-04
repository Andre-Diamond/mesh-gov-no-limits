import { FC } from 'react';
import styles from '../styles/CatalystProposalsList.module.css';

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

interface CatalystProposalsListProps {
    data: CatalystData;
}

const CatalystProposalsList: FC<CatalystProposalsListProps> = ({ data }) => {
    // Format the timestamp consistently using UTC to avoid timezone issues
    const formatDate = (timestamp: string): string => {
        const date = new Date(timestamp);
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours() % 12 || 12;
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const ampm = date.getUTCHours() >= 12 ? 'PM' : 'AM';

        return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm} UTC`;
    };

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Budget (ADA)</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Category</th>
                        <th>Funds Distributed (ADA)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.projects.map((project) => (
                        <tr key={project.projectDetails.id}>
                            <td>{project.projectDetails.title}</td>
                            <td>{formatAda(project.projectDetails.budget)}</td>
                            <td>{project.projectDetails.status}</td>
                            <td>{project.projectDetails.milestones_qty === 0 ? '0' : Math.round((project.milestonesCompleted / project.projectDetails.milestones_qty) * 100)}%</td>
                            <td>{project.projectDetails.category}</td>
                            <td>{formatAda(project.projectDetails.funds_distributed)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.timestamp}>
                Last updated: {formatDate(data.timestamp)}
            </div>
        </div>
    );
};

export default CatalystProposalsList; 