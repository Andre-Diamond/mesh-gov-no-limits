import { FC } from 'react';
import styles from '../styles/Proposals.module.css';
import { CatalystData, CatalystProject } from '../types';

// Simple number formatting function that doesn't rely on locale settings
const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format ADA amount with symbol
const formatAda = (amount: number): string => {
    return `₳${formatNumber(amount)}`;
};

// Calculate progress percentage safely
const calculateProgress = (completed: number | undefined, total: number): number => {
    if (completed === undefined || total === 0) {
        return 0;
    }
    return Math.round((completed / total) * 100);
};

// Format title for URL
const formatTitleForUrl = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/&/g, 'and') // Replace & with 'and'
        .replace(/,/g, '') // Remove commas
        .replace(/[^\w\s-]/g, '') // Remove other special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

// Get funding round from category (first 3 characters)
const getFundingRound = (category: string): string => {
    return category.trim().substring(0, 3);
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
        <>
            <ul className={styles.list}>
                {data.projects.map((project) => {
                    // Calculate progress safely
                    const progressPercent = calculateProgress(project.milestonesCompleted, project.projectDetails.milestones_qty);

                    // Format category for URL
                    const formattedCategory = formatTitleForUrl(project.projectDetails.category);
                    // Format title for URL
                    const formattedTitle = formatTitleForUrl(project.projectDetails.title);

                    return (
                        <li key={project.projectDetails.id} className={styles.card} data-testid="proposal-item">
                            <div className={styles.header}>
                                <h3 className={styles.title}>{project.projectDetails.title}</h3>
                                <span className={`${styles.status} ${project.projectDetails.status === 'Completed' ? styles.completed :
                                    project.projectDetails.status === 'In Progress' ? styles.inProgress : styles.onHold
                                    }`}>
                                    {project.projectDetails.status}
                                </span>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.progress}>
                                    <div className={styles.progressLabel}>
                                        Progress: <span className={styles.progressValue}>{progressPercent}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={`${styles.progressFill} ${progressPercent >= 75 ? styles.progressHigh :
                                                progressPercent >= 25 ? styles.progressMedium :
                                                    styles.progressLow
                                                }`}
                                            style={{
                                                width: `${progressPercent}%`
                                            }}
                                        >
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.detailsTable}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Fund</th>
                                                <th>Budget</th>
                                                <th className={styles.hideMobile}>Distributed</th>
                                                <th className={styles.hideMobile}>Project ID</th>
                                                <th>Milestones</th>
                                            </tr>
                                            <tr>
                                                <td>{getFundingRound(project.projectDetails.category)}</td>
                                                <td>{formatAda(project.projectDetails.budget)}</td>
                                                <td className={styles.hideMobile}>{formatAda(project.projectDetails.funds_distributed)}</td>
                                                <td className={styles.hideMobile}>{project.projectDetails.project_id}</td>
                                                <td>{project.milestonesCompleted ?? 0}/{project.projectDetails.milestones_qty}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                <a
                                    href={`https://milestones.projectcatalyst.io/projects/${project.projectDetails.project_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.cardButton}
                                >
                                    View Milestones
                                </a>
                                <a
                                    href={`https://projectcatalyst.io/funds/13/${formattedCategory}/${formattedTitle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.cardButton}
                                >
                                    View Details
                                </a>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className={styles.timestamp}>
                Last updated: {formatDate(data.timestamp)}
            </div>
        </>
    );
};

export default CatalystProposalsList; 