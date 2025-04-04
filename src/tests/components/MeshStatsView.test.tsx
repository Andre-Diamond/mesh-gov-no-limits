import { render, screen } from '@testing-library/react';
import MeshStatsView from '../../components/MeshStatsView';

const mockCurrentStats = {
    github: {
        core_in_package_json: 336,
        core_in_any_file: 1228
    },
    npm: {
        downloads: {
            last_day: 261,
            last_week: 2337,
            last_month: 10635,
            last_year: 69030
        },
        react_package_downloads: 9465,
        transaction_package_downloads: 9922,
        wallet_package_downloads: 10263,
        provider_package_downloads: 9995,
        core_csl_package_downloads: 5915,
        core_cst_package_downloads: 10148,
        latest_version: "1.9.0-beta.25",
        dependents_count: 275459
    }
};

const mockStats2024 = {
    year: 2024,
    yearlyTotals: {
        core: 56420,
        react: 34716,
        transaction: 21088,
        wallet: 20554,
        provider: 19613,
        coreCsl: 22928,
        coreCst: 24256
    },
    monthlyDownloads: [
        { month: "December", downloads: 6929, trend: "🔥" }
    ],
    peakMonth: {
        name: "December",
        downloads: 6929
    }
};

const mockStats2025 = {
    year: 2025,
    yearlyTotals: {
        core: 24637,
        react: 23232,
        transaction: 23661,
        wallet: 24289,
        provider: 23133,
        coreCsl: 16875,
        coreCst: 24359
    },
    monthlyDownloads: [
        { month: "March", downloads: 10635, trend: "🔥" }
    ],
    peakMonth: {
        name: "March",
        downloads: 10635
    }
};

describe('MeshStatsView', () => {
    it('renders the component with all statistics', () => {
        render(
            <MeshStatsView
                currentStats={mockCurrentStats}
                stats2024={mockStats2024}
                stats2025={mockStats2025}
            />
        );

        // Check title and version
        expect(screen.getByText('Mesh SDK Statistics')).toBeInTheDocument();
        expect(screen.getByText('Latest Version: 1.9.0-beta.25')).toBeInTheDocument();

        // Check current stats
        expect(screen.getByText('261')).toBeInTheDocument(); // last_day
        expect(screen.getByText('2,337')).toBeInTheDocument(); // last_week
        expect(screen.getByText('10,635')).toBeInTheDocument(); // last_month

        // Check GitHub stats
        expect(screen.getByText('336')).toBeInTheDocument(); // core_in_package_json
        expect(screen.getByText('1,228')).toBeInTheDocument(); // core_in_any_file

        // Check yearly comparisons
        expect(screen.getByText('2024')).toBeInTheDocument();
        expect(screen.getByText('2025')).toBeInTheDocument();
        expect(screen.getByText('Total Core Downloads: 56,420')).toBeInTheDocument();
        expect(screen.getByText('Total Core Downloads: 24,637')).toBeInTheDocument();
    });

    it('formats numbers with commas correctly', () => {
        render(
            <MeshStatsView
                currentStats={mockCurrentStats}
                stats2024={mockStats2024}
                stats2025={mockStats2025}
            />
        );

        expect(screen.getByText('275,459')).toBeInTheDocument(); // dependents_count
        expect(screen.getByText('69,030')).toBeInTheDocument(); // last_year
    });

    it('displays monthly trends correctly', () => {
        render(
            <MeshStatsView
                currentStats={mockCurrentStats}
                stats2024={mockStats2024}
                stats2025={mockStats2025}
            />
        );

        expect(screen.getByText('Monthly Downloads Trend (2025)')).toBeInTheDocument();
        expect(screen.getByText('Package Downloads (Last Month)')).toBeInTheDocument();
    });

    it('displays charts correctly', () => {
        render(
            <MeshStatsView
                currentStats={mockCurrentStats}
                stats2024={mockStats2024}
                stats2025={mockStats2025}
            />
        );

        // Check chart titles
        expect(screen.getByText('Package Downloads (Last Month)')).toBeInTheDocument();
        expect(screen.getByText('Monthly Downloads Trend (2025)')).toBeInTheDocument();
    });

    it('displays peak month information correctly', () => {
        render(
            <MeshStatsView
                currentStats={mockCurrentStats}
                stats2024={mockStats2024}
                stats2025={mockStats2025}
            />
        );

        expect(screen.getByText('Peak Month: December (6,929)')).toBeInTheDocument();
        expect(screen.getByText('Peak Month: March (10,635)')).toBeInTheDocument();
    });

    it('displays GitHub usage statistics correctly', () => {
        render(
            <MeshStatsView
                currentStats={mockCurrentStats}
                stats2024={mockStats2024}
                stats2025={mockStats2025}
            />
        );

        expect(screen.getByText('GitHub Usage')).toBeInTheDocument();
        expect(screen.getByText('Projects Using Mesh')).toBeInTheDocument();
        expect(screen.getByText('Total File References')).toBeInTheDocument();
        expect(screen.getByText('Dependent Projects')).toBeInTheDocument();
    });

    it('displays time-based download statistics correctly', () => {
        render(
            <MeshStatsView
                currentStats={mockCurrentStats}
                stats2024={mockStats2024}
                stats2025={mockStats2025}
            />
        );

        expect(screen.getByText('Last 24 Hours')).toBeInTheDocument();
        expect(screen.getByText('Last Week')).toBeInTheDocument();
        expect(screen.getByText('Last Month')).toBeInTheDocument();
        expect(screen.getByText('Last Year')).toBeInTheDocument();
    });
}); 