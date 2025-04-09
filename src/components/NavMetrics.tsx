import { useData } from '../contexts/DataContext';
import styles from '../styles/NavMetrics.module.css';

const NavMetrics = () => {
    const { meshData, catalystData, isLoading } = useData();

    if (isLoading) return null;

    // Calculate metrics
    const totalVotes = meshData?.votes?.length || 0;
    const allVotes = meshData?.votes || [];
    const yesVotes = allVotes.filter(v => v.vote === 'Yes').length;
    const noVotes = allVotes.filter(v => v.vote === 'No').length;

    const totalProposals = catalystData?.catalystData?.projects?.length || 0;
    const completedProposals = catalystData?.catalystData?.projects?.filter(
        (p: any) => p.projectDetails.status === 'Completed'
    ).length || 0;
    const totalBudget = catalystData?.catalystData?.projects?.reduce(
        (sum: number, p: any) => sum + p.projectDetails.budget, 0
    ) || 0;

    const downloads = meshData?.currentStats?.npm?.downloads?.last_month || 0;
    const githubUsage = meshData?.currentStats?.github?.core_in_package_json || 0;
    const dependentProjects = meshData?.currentStats?.npm?.dependents_count || 0;

    // Format number helper
    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Format ADA amount with symbol
    const formatAda = (amount: number): string => {
        return `₳${formatNumber(amount)}`;
    };

    return (
        <div className={styles.metricsContainer}>
            <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                    <span className={styles.metricTitle}>DRep Voting</span>
                    <div className={`${styles.metricIcon} ${styles.iconGreen}`}></div>
                </div>
                <div className={styles.metricValue}>{totalVotes}</div>
                <div className={styles.metricSubtext}>
                    {yesVotes} Yes • {noVotes} No votes
                </div>
                <div className={styles.metricExtra}>
                    Last vote: {allVotes[0] ? new Date(allVotes[0].blockTime).toLocaleDateString() : 'N/A'}
                </div>
            </div>

            <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                    <span className={styles.metricTitle}>Catalyst Proposals</span>
                    <div className={`${styles.metricIcon} ${styles.iconBlue}`}></div>
                </div>
                <div className={styles.metricValue}>{totalProposals}</div>
                <div className={styles.metricSubtext}>
                    {completedProposals} completed ({Math.round((completedProposals / totalProposals) * 100)}%)
                </div>
                <div className={styles.metricExtra}>
                    Total budget: {formatAda(totalBudget)}
                </div>
            </div>

            <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                    <span className={styles.metricTitle}>SDK Downloads</span>
                    <div className={`${styles.metricIcon} ${styles.iconYellow}`}></div>
                </div>
                <div className={styles.metricValue}>{formatNumber(downloads)}</div>
                <div className={styles.metricSubtext}>
                    {githubUsage} projects using Mesh
                </div>
                <div className={styles.metricExtra}>
                    {dependentProjects} dependent packages
                </div>
            </div>
        </div>
    );
};

export default NavMetrics; 