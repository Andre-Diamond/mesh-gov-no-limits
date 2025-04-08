import PlaceholderChart from '../components/PlaceholderChart';
import PlaceholderTable from '../components/PlaceholderTable';
import { useData } from '../contexts/DataContext';

export default function Home() {
    const { meshData, catalystData, isLoading, error } = useData();

    if (isLoading) {
        return <main>Loading...</main>;
    }

    if (error) {
        return <main>Error: {error}</main>;
    }

    return (
        <main>
            <h1>Hello from Mesh Governance</h1>
            <PlaceholderChart />
            <PlaceholderTable />
            <div className="data-display">
                <h2>Latest Mesh Data</h2>
                <pre>{JSON.stringify(meshData?.currentStats, null, 2)}</pre>
                {catalystData && (
                    <>
                        <h2>Latest Catalyst Data</h2>
                        <pre>{JSON.stringify(catalystData.catalystData, null, 2)}</pre>
                    </>
                )}
            </div>
        </main>
    );
} 