import { useData } from '../contexts/DataContext';
import styles from '../styles/NavMetrics.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

    // Calculate milestone statistics
    const milestonesStats = catalystData?.catalystData?.projects?.reduce(
        (acc: { total: number; completed: number }, project: any) => {
            const totalMilestones = project.projectDetails.milestones_qty || 0;
            const completedMilestones = project.milestonesCompleted || 0;

            return {
                total: acc.total + totalMilestones,
                completed: acc.completed + completedMilestones
            };
        },
        { total: 0, completed: 0 }
    ) || { total: 0, completed: 0 };

    const remainingMilestones = milestonesStats.total - milestonesStats.completed;

    const totalBudget = catalystData?.catalystData?.projects?.reduce(
        (sum: number, p: any) => sum + p.projectDetails.budget, 0
    ) || 0;

    const fundsDistributed = catalystData?.catalystData?.projects?.reduce(
        (sum: number, p: any) => sum + p.projectDetails.funds_distributed, 0
    ) || 0;

    const fundingRemaining = totalBudget - fundsDistributed;

    // Prepare data for pie charts
    const statusData = [
        { name: 'Completed Milestones', value: milestonesStats.completed },
        { name: 'Remaining Milestones', value: remainingMilestones }
    ];

    const fundingData = [
        { name: 'Distributed', value: fundsDistributed },
        { name: 'Remaining', value: fundingRemaining }
    ];

    // Update colors for better contrast
    const COLORS = ['#00C49F', '#FF8042'];
    const FUNDING_COLORS = ['#0088FE', '#00C49F'];

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
                <div className={styles.chartsContainer}>
                    <div className={styles.chartWrapper}>
                        <h4>Milestone Progress</h4>
                        <ResponsiveContainer width="100%" height={140}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={25}
                                    outerRadius={50}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value} milestone${value !== 1 ? 's' : ''}`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className={styles.chartSubtext}>
                            {milestonesStats.completed} of {milestonesStats.total} milestones completed
                        </div>
                    </div>
                    <div className={styles.chartWrapper}>
                        <h4>Funding Status</h4>
                        <ResponsiveContainer width="100%" height={140}>
                            <PieChart>
                                <Pie
                                    data={fundingData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={25}
                                    outerRadius={50}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {fundingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={FUNDING_COLORS[index % FUNDING_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `₳${formatNumber(value)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className={styles.metricExtra}>
                    Total budget: {formatAda(totalBudget)}
                    <br />
                    Remaining: {formatAda(fundingRemaining)} ({Math.round((fundingRemaining / totalBudget) * 100)}%)
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