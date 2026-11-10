import { useEffect, useRef, useState } from 'react';

type OutreachAiAssistantProps = {
    companyName: string;
    targetMarket: string;
};

function OutreachAiAssistant({
    companyName,
    targetMarket,
}: OutreachAiAssistantProps) {

    const [draft, setDraft] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [companyName, targetMarket]);

    async function generateDraft() {
        abortControllerRef.current?.abort();

        const controller = new AbortController();
        abortControllerRef.current = controller;


        setIsGenerating(true);
        setError(null);
        setDraft('');
        setCopyStatus(null);

        try {
            const response = await fetch(
                '/recommendations/ai/outreach-draft',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        companyName,
                        targetMarket,
                    }),
                    signal: controller.signal,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data: { draft: string } = await response.json();

            if (!controller.signal.aborted) {
                setDraft(data.draft);
            }
        } catch (error) {
            if (!controller.signal.aborted) {
                console.error('AI draft generation failed:', error);
                setError('Unable to generate an email. Please try again.');
            }
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;

                if (!controller.signal.aborted) {
                    setIsGenerating(false);
                }
            }
        }
    }

    async function copyEmail() {
        setCopyStatus(null);

        try {
            await navigator.clipboard.writeText(draft);
            setCopyStatus('Email copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy email:', error);
            setCopyStatus('Unable to copy email. Please try again.');
        }
    }

    return (
        <div className="ai-assistant-panel">
            <h2>AI Outreach Assistant</h2>

            <p>
                Selected company: <strong>{companyName}</strong>
            </p>

            <button
                type="button"
                onClick={() => void generateDraft()}
                disabled={isGenerating}
            >
                {isGenerating ? 'Generating...' : 'Generate AI Email'}
            </button>

            {error && <p role="alert">{error}</p>}

            {draft && (
                <>
                    <h3>Generated Email</h3>

                    <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={12}
                        aria-label="AI-generated outreach email"
                    />

                    <button
                        type="button"
                        onClick={() => void copyEmail()}
                    >
                        Copy Email
                    </button>

                    {copyStatus && (
                        <p role="status" className="ai-copy-status">
                            {copyStatus}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default OutreachAiAssistant;