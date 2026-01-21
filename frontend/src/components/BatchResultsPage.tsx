import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BatchResultsPage = () => {
  const { batchId } = useParams();
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/v1/batches/${batchId}/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setResults(data.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (batchId) {
      fetchResults();
    }
  }, [batchId]);

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "24px" }}>
        Analysis Results for Batch{" "}
        <span className="text-gradient-primary">{batchId}</span>
      </h1>

      {isLoading && <p>Loading results...</p>}
      {error && <p style={{ color: "var(--error)" }}>Error: {error}</p>}

      <div className="glass" style={{ padding: "32px" }}>
        {results.length > 0 ? (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: "16px",
            }}
          >
            {results.map((result, index) => (
              <li
                key={index}
                className="glass card-hover"
                style={{ padding: "24px", borderRadius: "16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    {result.filename}
                  </h3>
                  <span
                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                  >
                    Status: {result.status}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                  }}
                >
                  <strong style={{ color: "white" }}>AI:</strong>{" "}
                  {result.ai_analysis?.score !== null &&
                  result.ai_analysis?.score !== undefined
                    ? `${Math.round(result.ai_analysis.score * 100)}% (${result.ai_analysis.is_ai ? "AI-generated" : "Human"})`
                    : "Pending"}
                </div>

                <div style={{ marginTop: "12px" }}>
                  <strong style={{ fontSize: "14px" }}>
                    Plagiarism matches:
                  </strong>
                  {result.plagiarism_analysis &&
                  result.plagiarism_analysis.length > 0 ? (
                    <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
                      {result.plagiarism_analysis.map(
                        (match: any, idx: number) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {match.similar_document} -{" "}
                            {Math.round(match.similarity * 100)}%
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p
                      style={{
                        marginTop: "8px",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                      }}
                    >
                      No matches found.
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found for this batch.</p>
        )}
      </div>
    </div>
  );
};

export default BatchResultsPage;
