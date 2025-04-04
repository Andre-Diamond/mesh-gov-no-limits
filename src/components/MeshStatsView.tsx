import { FC } from 'react';
import styles from '../styles/MeshStatsView.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Downloads {
    last_day: number;
    last_week: number;
    last_month: number;
    last_year: number;
}

interface MonthlyDownload {
    month: string;
    downloads: number;
    trend: string;
}

interface YearlyTotals {
    core: number;
    react: number;
    transaction: number;
    wallet: number;
    provider: number;
    coreCsl: number;
    coreCst: number;
}

interface MeshStats {
    github: {
        core_in_package_json: number;
        core_in_any_file: number;
    };
    npm: {
        downloads: Downloads;
        react_package_downloads: number;
        transaction_package_downloads: number;
        wallet_package_downloads: number;
        provider_package_downloads: number;
        core_csl_package_downloads: number;
        core_cst_package_downloads: number;
        latest_version: string;
        dependents_count: number;
    };
}

interface YearlyStats {
    year: number;
    yearlyTotals: YearlyTotals;
    monthlyDownloads: MonthlyDownload[];
    peakMonth: {
        name: string;
        downloads: number;
    };
}

interface MeshStatsViewProps {
    currentStats: MeshStats;
    stats2024: YearlyStats;
    stats2025: YearlyStats;
}

const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
};

const MeshStatsView: FC<MeshStatsViewProps> = ({ currentStats, stats2024, stats2025 }) => {
    const packageData = [
        { name: 'Core', downloads: currentStats.npm.downloads.last_month },
        { name: 'React', downloads: currentStats.npm.react_package_downloads },
        { name: 'Transaction', downloads: currentStats.npm.transaction_package_downloads },
        { name: 'Wallet', downloads: currentStats.npm.wallet_package_downloads },
        { name: 'Provider', downloads: currentStats.npm.provider_package_downloads },
        { name: 'Core CSL', downloads: currentStats.npm.core_csl_package_downloads },
        { name: 'Core CST', downloads: currentStats.npm.core_cst_package_downloads },
    ];

    const monthlyData = stats2025.monthlyDownloads.map(month => ({
        name: month.month,
        downloads: month.downloads,
        trend: month.trend
    }));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Mesh SDK Statistics</h1>
                <p className={styles.version}>Latest Version: {currentStats.npm.latest_version}</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.stat}>
                    <h3>Last 24 Hours</h3>
                    <p>{formatNumber(currentStats.npm.downloads.last_day)}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Last Week</h3>
                    <p>{formatNumber(currentStats.npm.downloads.last_week)}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Last Month</h3>
                    <p>{formatNumber(currentStats.npm.downloads.last_month)}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Last Year</h3>
                    <p>{formatNumber(currentStats.npm.downloads.last_year)}</p>
                </div>
            </div>

            <div className={styles.githubStats}>
                <h2>GitHub Usage</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.stat}>
                        <h3>Projects Using Mesh</h3>
                        <p>{formatNumber(currentStats.github.core_in_package_json)}</p>
                    </div>
                    <div className={styles.stat}>
                        <h3>Total File References</h3>
                        <p>{formatNumber(currentStats.github.core_in_any_file)}</p>
                    </div>
                    <div className={styles.stat}>
                        <h3>Dependent Projects</h3>
                        <p>{formatNumber(currentStats.npm.dependents_count)}</p>
                    </div>
                </div>
            </div>

            <div className={styles.chartSection}>
                <h2>Package Downloads (Last Month)</h2>
                <div className={styles.chart}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={packageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="downloads" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.chartSection}>
                <h2>Monthly Downloads Trend (2025)</h2>
                <div className={styles.chart}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="downloads" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.yearlyComparison}>
                <h2>Yearly Comparison</h2>
                <div className={styles.yearGrid}>
                    <div className={styles.year}>
                        <h3>2024</h3>
                        <p>Total Core Downloads: {formatNumber(stats2024.yearlyTotals.core)}</p>
                        <p>Peak Month: {stats2024.peakMonth.name} ({formatNumber(stats2024.peakMonth.downloads)})</p>
                    </div>
                    <div className={styles.year}>
                        <h3>2025</h3>
                        <p>Total Core Downloads: {formatNumber(stats2025.yearlyTotals.core)}</p>
                        <p>Peak Month: {stats2025.peakMonth.name} ({formatNumber(stats2025.peakMonth.downloads)})</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeshStatsView; 