import { useData } from '../contexts/DataContext';
import styles from '../styles/NavMetrics.module.css';

const NavMetrics = () => {
    const { meshData, catalystData, isLoading } = useData();

    if (isLoading) return null;

    // Calculate metrics
    const totalVotes = meshData?.votes?.length || 0;
    const allVotes = meshData?.votes || [];

    // Calculate yearly vote statistics
    const yearlyVotes = allVotes.reduce((acc: Record<string, { yes: number; no: number; abstain: number }>, vote) => {
        const year = new Date(vote.blockTime).getFullYear();
        if (!acc[year]) {
            acc[year] = { yes: 0, no: 0, abstain: 0 };
        }
        acc[year][vote.vote.toLowerCase() as 'yes' | 'no' | 'abstain']++;
        return acc;
    }, {});

    // Sort years in descending order
    const sortedYears = Object.keys(yearlyVotes).sort((a, b) => Number(b) - Number(a));

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
                <div className={styles.yearlyTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Yes</th>
                                <th>No</th>
                                <th>Abs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedYears.map(year => (
                                <tr key={year}>
                                    <td>{year}</td>
                                    <td>{yearlyVotes[year].yes}</td>
                                    <td>{yearlyVotes[year].no}</td>
                                    <td>{yearlyVotes[year].abstain}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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