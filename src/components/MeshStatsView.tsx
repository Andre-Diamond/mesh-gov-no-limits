import { FC } from 'react';
import styles from '../styles/MeshStats.module.css';
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

export interface FilteredStats {
    packageData?: { name: string; downloads: number }[];
    monthlyData?: { name: string; downloads: number; trend: string }[];
    currentStats?: any;
    yearlyStats?: Record<number, any>;
}

interface MeshStatsViewProps {
    currentStats: MeshStats;
    yearlyStats: Record<number, YearlyStats>;
    filteredStats?: FilteredStats;
}

const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

const MeshStatsView: FC<MeshStatsViewProps> = ({ currentStats, yearlyStats, filteredStats }) => {
    // Determine if we're showing filtered data or all data
    const isFiltered = !!filteredStats && (filteredStats.packageData?.length || filteredStats.monthlyData?.length);

    // Use filtered package data if available, otherwise use all data
    const packageData = isFiltered && filteredStats?.packageData
        ? filteredStats.packageData
        : currentStats?.npm ? [
            { name: 'Core', downloads: currentStats.npm.downloads.last_month },
            { name: 'React', downloads: currentStats.npm.react_package_downloads },
            { name: 'Transaction', downloads: currentStats.npm.transaction_package_downloads },
            { name: 'Wallet', downloads: currentStats.npm.wallet_package_downloads },
            { name: 'Provider', downloads: currentStats.npm.provider_package_downloads },
            { name: 'Core CSL', downloads: currentStats.npm.core_csl_package_downloads },
            { name: 'Core CST', downloads: currentStats.npm.core_cst_package_downloads },
        ] : [];

    const years = Object.keys(yearlyStats || {}).map(Number).sort((a, b) => b - a);
    const latestYear = years[0];

    // Use filtered monthly data if available, otherwise use all data
    const monthlyData = isFiltered && filteredStats?.monthlyData
        ? filteredStats.monthlyData
        : latestYear && yearlyStats?.[latestYear]?.monthlyDownloads
            ? yearlyStats[latestYear].monthlyDownloads.map((month: MonthlyDownload) => ({
                name: month.month,
                downloads: month.downloads,
                trend: month.trend
            }))
            : [];

    return (
        <div data-testid="mesh-stats-view">
            {isFiltered && (
                <div className={styles.filterNotice}>
                    <h2>Filtered Results</h2>
                    <p>Showing filtered statistics based on your search criteria.</p>
                </div>
            )}

            {currentStats?.npm?.downloads && !isFiltered && (
                <div className={styles.statsGrid}>
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
            )}

            {currentStats?.github && !isFiltered && (
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
                        {currentStats.npm?.dependents_count && (
                            <div className={styles.stat}>
                                <h3>Dependent Projects</h3>
                                <p>{formatNumber(currentStats.npm.dependents_count)}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {packageData.length > 0 && (
                <div className={styles.chartSection}>
                    <h2>Package Downloads {isFiltered ? '(Filtered)' : '(Last Month)'}</h2>
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
            )}

            {monthlyData.length > 0 && (
                <div className={styles.chartSection}>
                    <h2>Monthly Downloads Trend {isFiltered ? '(Filtered)' : `(${latestYear})`}</h2>
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
            )}

            {years.length > 0 && !isFiltered && (
                <div className={styles.chartSection}>
                    <h2>Yearly Comparison</h2>
                    <div className={styles.yearGrid}>
                        {years.map(year => (
                            <div key={year} className={styles.year}>
                                <h3>{year}</h3>
                                <p>Total Core Downloads: {formatNumber(yearlyStats[year].yearlyTotals.core)}</p>
                                <p>Peak Month: {yearlyStats[year].peakMonth.name} ({formatNumber(yearlyStats[year].peakMonth.downloads)})</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeshStatsView; 