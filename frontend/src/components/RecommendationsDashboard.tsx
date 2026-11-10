
import { useEffect, useState } from 'react';
import './RecommendationsDashboard.css';
import OutreachAiAssistant from './OutreachAiAssistant';

type RankedCompany = {
    companyId: number;
    companyName: string;
    score: number;
    reasons: string[];
};

type Campaign = {
    campaignId: number;
    campaignName: string;
    targetMarket: string | null;
};

function RecommendationsDashboard() {
    const [selectedCampaignId, setSelectedCampaignId] = useState<number>(1);
    const [selectedCompany, setSelectedCompany] =
        useState<RankedCompany | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [recommendations, setRecommendations] = useState<RankedCompany[]>([]);
    const [sortOrder, setSortOrder] = useState<'highest' | 'lowest'>('highest');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const selectedCampaign = campaigns.find(
        (campaign) => campaign.campaignId === selectedCampaignId
    );

    const sortedRecommendations = [...recommendations].sort(
        (a, b) =>
            sortOrder === 'highest'
                ? b.score - a.score
                : a.score - b.score
    );

    // Load available campaigns
    useEffect(() => {
        const controller = new AbortController();

        async function loadCampaigns() {
            try {
                const response = await fetch('/recommendations/campaigns', {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to load campaigns: ${response.status}`
                    );
                }

                const data: Campaign[] = await response.json();

                if (!controller.signal.aborted) {
                    setCampaigns(data);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Error loading campaigns:', error);
                }
            }
        }

        void loadCampaigns();

        return () => controller.abort();
    }, []);

    // Load recommendations for the selected campaign
    useEffect(() => {
        if (!selectedCampaign?.targetMarket) {
            setRecommendations([]);
            setError(null);
            setIsLoading(false);
            return;
        }

        const targetMarket = selectedCampaign.targetMarket;
        const controller = new AbortController();

        async function loadRecommendations() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    '/recommendations/companies/generate',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            campaignId: selectedCampaignId,
                            targetMarket,
                            evaluationDate: new Date()
                                .toLocaleDateString('en-CA'),
                        }),
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data: {
                    campaignId: number;
                    recommendations: RankedCompany[];
                } = await response.json();

                if (!controller.signal.aborted) {
                    setRecommendations(data.recommendations);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error(
                        'Failed to load recommendations:',
                        error
                    );
                    setError(
                        'Failed to load recommendations. Please try again later.'
                    );
                    setRecommendations([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadRecommendations();

        return () => controller.abort();
    }, [selectedCampaignId, selectedCampaign?.targetMarket]);

    return (
        <section className="recommendations-dashboard">
            <h1>Outreach Recommendations</h1>

            <p className="recommendations-subtitle">
                Companies ranked by outreach priority.
            </p>

            {/* Campaign selection */}
            <div className="recommendations-controls">
                <label htmlFor="campaign-select">
                    Select Campaign:
                </label>

                <select
                    id="campaign-select"
                    value={selectedCampaignId}
                    onChange={(event) => {
                        setSelectedCampaignId(Number(event.target.value));
                        setSelectedCompany(null);
                        setRecommendations([]);
                    }}
                >
                    {campaigns.map((campaign) => (
                        <option
                            key={campaign.campaignId}
                            value={campaign.campaignId}
                        >
                            {campaign.campaignName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sorting */}
            <div className="recommendations-controls">
                <label htmlFor="sort-order">
                    Sort By:
                </label>

                <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(event) =>
                        setSortOrder(
                            event.target.value as 'highest' | 'lowest'
                        )
                    }
                >
                    <option value="highest">
                        Highest Score First
                    </option>
                    <option value="lowest">
                        Lowest Score First
                    </option>
                </select>
            </div>

            {isLoading && (
                <p role="status">
                    Loading recommendations...
                </p>
            )}

            {error && (
                <p role="alert" className="recommendations-error">
                    {error}
                </p>
            )}

            {/* TML-55: Two-column workspace */}
            <div className="recommendations-workspace">

                {/* Left column: Ranked companies */}
                <div className="recommendations-list">

                    {!isLoading && !error &&
                        sortedRecommendations.map((company) => (
                            <article
                                key={company.companyId}
                                className={`recommendation-card ${
                                    selectedCompany?.companyId === company.companyId
                                        ? 'recommendation-card-selected'
                                        : ''
                                }`}
                            >
                                <div className="recommendation-card-header">
                                    <h2>{company.companyName}</h2>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedCompany(company)}
                                        aria-pressed={selectedCompany?.companyId === company.companyId}
                                    >
                                        {selectedCompany?.companyId === company.companyId
                                            ? 'Selected'
                                            : 'Select'}
                                    </button>
                                </div>

                                <p className="recommendation-score">
                                    <strong>
                                        Recommendation Score: {company.score}
                                    </strong>
                                </p>

                                <div
                                    className="recommendation-score-bar"
                                    role="progressbar"
                                    aria-label={`${company.companyName} recommendation score`}
                                    aria-valuenow={company.score}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div
                                        className="recommendation-score-fill"
                                        style={{
                                            width: `${Math.max(
                                                0,
                                                Math.min(company.score, 100)
                                            )}%`,
                                            backgroundColor:
                                                company.score >= 75
                                                    ? '#16a34a'
                                                    : company.score >= 50
                                                        ? '#eab308'
                                                        : '#dc2626',
                                        }}
                                    />
                                </div>

                                <ul className="recommendation-reasons">
                                    {company.reasons.map((reason, index) => (
                                        <li key={`${company.companyId}-${index}`}>
                                            {reason}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                </div>

                {/* Right column: AI Outreach Assistant */}
                <div className="recommendations-assistant">
                    {selectedCompany && selectedCampaign?.targetMarket ? (
                        <OutreachAiAssistant
                            key={`${selectedCampaignId}-${selectedCompany.companyId}`}
                            companyName={selectedCompany.companyName}
                            targetMarket={selectedCampaign.targetMarket}
                        />
                    ) : (
                        <div className="ai-assistant-panel">
                            <h2>AI Outreach Assistant</h2>

                            <p>
                                Select a company from the recommendations
                                list to generate a professional English
                                consulting outreach email.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}

export default RecommendationsDashboard;
