import { ReactNode } from 'react';
import styles from '../styles/Dashboard.module.css';

export type StatusIconType = 'blue' | 'green' | 'yellow' | 'red';

interface StatusCardProps {
    title: string;
    iconType: StatusIconType;
    subtitle: string;
    actionLabel?: string;
    onActionClick?: () => void;
}

export default function StatusCard({
    title,
    iconType,
    subtitle,
    actionLabel,
    onActionClick
}: StatusCardProps) {
    // Map the icon type to the corresponding style
    const iconStyleMap: Record<StatusIconType, string> = {
        blue: styles.statusIconBlue,
        green: styles.statusIconGreen,
        yellow: styles.statusIconYellow,
        red: styles.statusIconRed
    };

    return (
        <div className={styles.statusItem}>
            <div className={styles.statusItemContent}>
                <div className={styles.statusItemTop}>
                    <div className={styles.statusLabel}>
                        <div className={`${styles.statusIcon} ${iconStyleMap[iconType]}`}></div>
                        <div className={styles.statusText} title={title}>
                            {title}
                        </div>
                    </div>
                </div>
                <div className={styles.statusItemBottom}>
                    <div className={styles.statusSubtext}>
                        {subtitle}
                    </div>
                    {actionLabel && onActionClick && (
                        <div className={styles.statusItemRight}>
                            <button
                                className={styles.viewMore}
                                onClick={onActionClick}
                            >
                                {actionLabel}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 