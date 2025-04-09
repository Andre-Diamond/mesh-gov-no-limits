import { FC } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Dashboard.module.css';

export type ResultType = 'vote' | 'proposal' | 'stat';

export interface SearchResult {
    id: string;
    title: string;
    subtitle: string;
    type: ResultType;
    value: string;
    iconType: 'green' | 'red' | 'yellow' | 'blue';
}

interface SearchResultCardProps {
    result: SearchResult;
}

const SearchResultCard: FC<SearchResultCardProps> = ({ result }) => {
    const router = useRouter();

    const handleClick = () => {
        // Navigate to the appropriate page based on result type
        switch (result.type) {
            case 'vote':
                router.push(`/vote-details/${result.id}`);
                break;
            case 'proposal':
                router.push(`/project-details/${result.id}`);
                break;
            case 'stat':
                router.push('/mesh-stats');
                break;
        }
    };

    // Map result type to readable text
    const getTypeLabel = (type: ResultType): string => {
        switch (type) {
            case 'vote': return 'DRep Vote';
            case 'proposal': return 'Catalyst Proposal';
            case 'stat': return 'Mesh Statistic';
        }
    };

    return (
        <div className={`${styles.statusItem} ${styles.clickableCard}`} onClick={handleClick}>
            <div className={styles.statusItemContent}>
                <div className={styles.statusItemTop}>
                    <div className={styles.statusLabel}>
                        <span className={`${styles.statusIcon} ${styles[`statusIcon${result.iconType.charAt(0).toUpperCase() + result.iconType.slice(1)}`]}`}></span>
                        <div className={styles.statusTitle}>
                            {result.title}
                            <span className={styles.statusType}>{getTypeLabel(result.type)}</span>
                        </div>
                    </div>
                    <div className={styles.statusValue}>{result.value}</div>
                </div>
                <div className={styles.statusItemBottom}>
                    <span className={styles.statusSubtext}>{result.subtitle}</span>
                    <div className={styles.statusItemRight}>
                        <span className={styles.viewMore}>View</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultCard; 