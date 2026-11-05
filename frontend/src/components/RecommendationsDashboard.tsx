import { useState } from 'react';
import './RecommendationsDashboard.css';

type RankedCompany = {
    companyId: number;
    companyName: string;
    score: number;
    reasons: string[];
};

const sampleRecommendations: RankedCompany[] = [
    {
        companyId: 101,
        companyName: 'Acme Technologies',
        score: 85,
        reasons: ['Target market match', 'Contact available', 'Follow-up overdue'],
    },
    {
        companyId: 102,
        companyName: 'Global Systems',
        score: 60,
        reasons: ['Target market match', 'Never contacted'],
    },
    {
        companyId: 103,
        companyName: 'Northstar Solutions',
        score: 40,
        reasons: ['Contact available', 'Follow-up due today'],
    },
];

function RecommendationsDashboard() {

    const [selectedCampaignId, setSelectedCampaignId] = useState<number>(1);

    const [sortOrder, setSortOrder] = useState<'highest' | 'lowest'>('highest');

    const sortedRecommendations = [...sampleRecommendations].sort(
    (a, b) =>
        sortOrder === 'highest'
        ? b.score - a.score
        : a.score - b.score
    );

    return (
        <section className="recommendations-dashboard">
            <h1>Outreach Recommendations</h1>
            <p className="recommendations-subtitle">Companies ranked by outreach priority.</p>

            <div className="recommendations-controls">
                <label htmlFor="campaign-select">Select Campaign: </label>

                <select
                    id="campaign-select"
                    value={selectedCampaignId}
                    onChange={(event) =>
                    setSelectedCampaignId(Number(event.target.value))
                    }
                >
                    <option value={1}>Campaign 1 — US Technology</option>
                    <option value={2}>Campaign 2 — General Outreach</option>
                </select>
            </div>

            <div className="recommendations-controls">
                <label htmlFor="sort-order">Sort By: </label>

                <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(event) =>
                    setSortOrder(event.target.value as 'highest' | 'lowest')
                    }
                >
                    <option value="highest">Highest Score First</option>
                    <option value="lowest">Lowest Score First</option>
                </select>
            </div>


            {sortedRecommendations.map((company) => (
                <article key={company.companyId}
                className="recommendation-card"
                >

                    <h2>{company.companyName}</h2>

                    <p className="recommendation-score">
                    <strong>Recommendation Score: {company.score}</strong>
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
                            width: `${Math.max(0, Math.min(company.score, 100))}%`,
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
                        {company.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                        ))}
                    </ul>
                </article>
            ))}

            <div className="ai-assistant-panel">
                <h2>AI Outreach Assistant</h2>
                <p>
                    AI-powered recommendation explanations and
                    personalized outreach email drafting will be
                    available in a future release.
                </p>
                <span className="ai-assistant-status">
                    Coming Soon — TML-48
                </span>
            </div>
        </section>
    );
}

export default RecommendationsDashboard;


