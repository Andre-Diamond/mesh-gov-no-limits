import PlaceholderChart from '../components/PlaceholderChart';
import PlaceholderTable from '../components/PlaceholderTable';
import fetchData from '../lib/fetchData';

export async function getStaticProps() {
    try {
        const data = await fetchData('https://raw.githubusercontent.com/Signius/mesh-automations/refs/heads/main/mesh-gov-updates/mesh-stats/mesh_stats.json');

        return {
            props: { data },
            revalidate: 60 * 60 * 24 * 7, // 7 days
        };
    } catch (error) {
        console.error('Fetch error:', error);
        return {
            props: { data: null, error: 'Failed to load data' },
            revalidate: 60 * 60 * 24 * 1, // Retry in 1 day
        };
    }
}

interface HomeProps {
    data: any;
    error?: string;
}

export default function Home({ data, error }: HomeProps) {
    return (
        <main>
            <h1>Hello from Mesh Governance</h1>
            <PlaceholderChart />
            <PlaceholderTable />
            <div className="data-display">
                <h2>Latest Data</h2>
                {error ? (
                    <p className="error">{error}</p>
                ) : (
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                )}
            </div>
        </main>
    );
} 