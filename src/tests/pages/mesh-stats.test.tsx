import { render, screen } from '@testing-library/react';
import MeshStats, { getStaticProps } from '../../pages/mesh-stats';
import fetchData from '../../lib/fetchData';
import { GetStaticPropsResult } from 'next';

interface MeshStatsPageProps {
    currentStats: any;
    stats2024: any;
    stats2025: any;
    error?: string;
}

jest.mock('../../lib/fetchData');
const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

describe('MeshStats Page', () => {
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

    beforeEach(() => {
        mockFetchData.mockClear();
    });

    it('renders MeshStatsView when data is loaded successfully', async () => {
        // Arrange
        mockFetchData
            .mockResolvedValueOnce(mockCurrentStats)
            .mockResolvedValueOnce(mockStats2024)
            .mockResolvedValueOnce(mockStats2025);

        // Act
        const result = (await getStaticProps({} as any)) as { props: MeshStatsPageProps; revalidate?: number };
        render(<MeshStats {...result.props} />);

        // Assert
        expect(screen.getByText('Mesh SDK Statistics')).toBeInTheDocument();
        expect(screen.getByText('Latest Version: 1.9.0-beta.25')).toBeInTheDocument();
    });

    it('renders error message when fetch fails', async () => {
        // Arrange
        mockFetchData.mockRejectedValue(new Error('Failed to fetch'));

        // Act
        const result = (await getStaticProps({} as any)) as { props: MeshStatsPageProps; revalidate?: number };
        render(<MeshStats {...result.props} />);

        // Assert
        expect(screen.getByText('Failed to load mesh statistics')).toBeInTheDocument();
    });

    it('renders loading state when data is null', async () => {
        // Arrange
        const props = {
            currentStats: null,
            stats2024: null,
            stats2025: null
        };

        // Act
        render(<MeshStats {...props} />);

        // Assert
        expect(screen.getByText('Loading mesh statistics...')).toBeInTheDocument();
    });

    it('revalidates daily on successful fetch', async () => {
        // Arrange
        mockFetchData
            .mockResolvedValueOnce(mockCurrentStats)
            .mockResolvedValueOnce(mockStats2024)
            .mockResolvedValueOnce(mockStats2025);

        // Act
        const result = await getStaticProps({} as any);

        // Assert
        expect(result.revalidate).toBe(60 * 60 * 24); // 24 hours
    });

    it('revalidates hourly on error', async () => {
        // Arrange
        mockFetchData.mockRejectedValue(new Error('Failed to fetch'));

        // Act
        const result = await getStaticProps({} as any);

        // Assert
        expect(result.revalidate).toBe(60 * 60); // 1 hour
    });
}); 