import { useEffect, useState } from "react";
import { db, collection, query, orderBy, limit, onSnapshot } from "../firebase";

export function TopScores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "scores"),
      orderBy("score", "desc"),
      limit(5),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedScores = [];
      querySnapshot.forEach((doc) => {
        updatedScores.push(doc.data());
      });
      setScores(updatedScores);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="top-scores">
      <h3>Top 5 Scores</h3>
      <ol>
        {scores.map((score, index) => (
          <li key={index}>
            {score.name}: {score.score}
            {index === 0 && " :)"}
            {index === 1}
            {index === 2}
          </li>
        ))}
      </ol>
    </div>
  );
}
