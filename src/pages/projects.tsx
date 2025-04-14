import { useData } from '../contexts/DataContext';
import styles from '../styles/Projects.module.css';
import PageHeader from '../components/PageHeader';
import { useState } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import Link from 'next/link';

// Interface for project data
interface Project {
    id: string;
    name: string;
    description: string;
    icon: string;
    url: string;
}

// Update the BuilderProject interface
interface BuilderProject {
    id: string;
    icon: string;
    url: string;
}

// Add this interface near the top with other interfaces
type HighlightedProject = {
    id: string;
    name: string;
    description: string;
    icon: string;
    url: string;
    category?: string;  // Make category optional
};

// Example projects - you can manually add more here
const projects: Project[] = [
    {
        id: '1',
        name: 'Mesh Core',
        description: 'Collection of comprehensive TypeScript libraries for blockchain development on Cardano.',
        icon: '/logo-mesh-white-512x512.png',
        url: 'https://github.com/MeshJS/mesh'
    },
    {
        id: '2',
        name: 'Midnight',
        description: 'Mesh Midnight providers tools and resources for developers to build on Midnight.',
        icon: '/Midnight-RGB_Symbol-White.png',
        url: 'https://github.com/MeshJS/midnight'
    },
    {
        id: '3',
        name: 'Multisig Platform',
        description: 'Secure your treasury and participant in Cardano governance as a team with multi-signatureSecure your treasury and participant in Cardano governance as a team with multi-signature. With Fluidtoken & ClarityDAO',
        icon: '/wallet.png',
        url: 'https://github.com/MeshJS/multisig'
    }
];


const builderProjects: BuilderProject[] = [
    {
        id: 'b1',
        icon: '/blink-labs.png',
        url: 'https://blinklabs.io/'
    },
    {
        id: 'b2',
        icon: '/nmkr.png',
        url: 'https://www.nmkr.io/'
    },
    {
        id: 'b3',
        icon: '/gimbalabs.png',
        url: '#'
    },
    {
        id: 'b4',
        icon: '/aiken.png',
        url: 'https://aiken-lang.org/'
    },
    {
        id: 'b5',
        icon: '/socious.png',
        url: 'https://socious.io/'
    },
    {
        id: 'b6',
        icon: '/txpipe.png',
        url: 'https://txpipe.io/'
    },
];

// Add this array with the other const arrays
const highlightedProjects: HighlightedProject[] = [
    {
        id: 'Gasless Tx Library',
        name: 'Gasless Tx Library',
        description: 'TypeScript library that enables gasless transactions on the Cardano blockchain.',
        icon: '/nucast.png',
        url: 'https://github.com/Nucastio/gasless-tx-ts',
    },
    {
        id: 'unsigned-frontend',
        name: 'unsigned-frontend',
        description: 'Frontend for unsigned_algorithms.',
        icon: '/images/projects/studio.png',
        url: 'https://github.com/alexanderwatanabe/unsigned-frontend',
    },
    {
        id: 'cardano-zk-proof-of-innocence',
        name: 'cardano-zk-proof-of-innocence',
        description: 'Proof of concept demonstrating the implementation of a Proof of Innocence protocol on Cardano.',
        icon: '/images/projects/marketplace.png',
        url: 'https://github.com/eryxcoop/cardano-zk-proof-of-innocence',
    },
    {
        id: 'governance.space',
        name: 'governance.space',
        description: 'Cardano Voltaire CIP-1694 Transparency & Community Portal.',
        icon: '/images/projects/wallet.png',
        url: 'https://github.com/disconnect-ventures/governance.space',
    },
    {
        id: 'hyperledger-identus',
        name: 'hyperledger-identus',
        description: 'Identus provides components to develop decentralized identity solutions that adhere to widely recognized self-sovereign identity (SSI) standards.',
        icon: '/images/projects/analytics.png',
        url: 'https://github.com/hyperledger-identus/.github',
        category: 'Development Tool'
    },
    {
        id: 'Intersect council-toolkit-app',
        name: 'Intersect council-toolkit-app',
        description: 'Web app for Intersect Constitutional Council.',
        icon: '/images/projects/bridge.png',
        url: 'https://github.com/IntersectMBO/council-toolkit-app',
        category: 'DApp Template'
    }
];

// Project Card Component
const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <div className={styles.projectCard}>
            <div className={styles.projectHeader}>
                <div className={styles.projectIcon}>
                    <img src={project.icon} alt={`${project.name} icon`} />
                </div>
                <h3 className={styles.projectName}>{project.name}</h3>
            </div>
            <p className={styles.projectDescription}>{project.description}</p>
            <Link 
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectLink}
            >
                View Project
            </Link>
        </div>
    );
};

// Add this component near the ProjectCard component
const HighlightedCard = ({ project }: { project: HighlightedProject }) => {
    return (
        <div className={styles.highlightedCard}>
            <div className={styles.projectHeader}>
                <div className={styles.projectIcon}>
                    <img src={project.icon} alt={`${project.name} icon`} />
                </div>
                <div>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <span className={styles.projectCategory}>{project.category}</span>
                </div>
            </div>
            <p className={styles.projectDescription}>{project.description}</p>
            <Link 
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectLink}
            >
                View Project
            </Link>
        </div>
    );
};

export default function Projects() {
    const { meshData, isLoading, error } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Error: {error}</div>
            </div>
        );
    }

    const githubUsage = meshData?.currentStats?.github?.core_in_package_json || 0;
    const totalReferences = meshData?.currentStats?.github?.core_in_any_file || 0;

    // Filter projects based on search term
    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter config for search
    const filterConfig = {
        placeholder: "Search projects...",
        filters: []
    };

    return (
        <div className={styles.container}>
            <PageHeader
                title={<>Mesh <span>Projects</span></>}
                subtitle="Projects using Mesh SDK in their GitHub repositories"
            />

            <SearchFilterBar
                config={filterConfig}
                onSearch={(term) => setSearchTerm(term)}
            />

            <div className={styles.stats}>
                <div className={styles.stat}>
                    <h3>Total Projects</h3>
                    <p>{githubUsage}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Total References</h3>
                    <p>{totalReferences}</p>
                </div>
            </div>

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Mesh Native Projects</h2>
                <p className={styles.sectionDescription}>Open Source Projects being built by the Mesh team</p>
            </div>

            <div className={styles.projectsGrid}>
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <div className={styles.noResults}>
                        {searchTerm ? 'No projects found matching your search.' : 'Add projects to display them here.'}
                    </div>
                )}
            </div>

            <div className={styles.moreSection}>
                <a 
                    href="https://meshjs.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.moreButton}
                >
                    Explore More Projects
                </a>
            </div>

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Trusted by Builders</h2>
            </div>

            <div className={styles.buildersGallery}>
                {builderProjects.map(project => (
                    <Link
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.builderItem}
                    >
                        <img src={project.icon} alt={`${project.id} icon`} />
                    </Link>
                ))}
            </div>

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Spotlight</h2>
                <p className={styles.sectionDescription}>Highlighting innovative projects powered by Mesh</p>
            </div>

            <div className={styles.highlightedGrid}>
                {highlightedProjects.map(project => (
                    <Link
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.highlightedCard}
                    >
                        <h3 className={styles.projectName}>{project.name}</h3>
                        <p className={styles.projectDescription}>{project.description}</p>
                    </Link>
                ))}
            </div>

            <div className={styles.moreSection}>
                <a 
                    href="https://github.com/MeshJS/mesh/network/dependents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.moreButton}
                >
                    Explore More Projects
                </a>
            </div>
        </div>
    );
} 