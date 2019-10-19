import { useState, useEffect, useRef } from "react";
import fetch from "isomorphic-fetch";

async function getTrending(params) {
  const value = typeof params === 'string' ? params : 'weekly';
  const res = await fetch(
    `https://github-trending-api.now.sh/repositories?language=javascript&since=${value}`
  );
  const json = await res.json();
  return { repos: json };
}

function Home({ repos }) {
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [laterRepos, setLaterRepos] = useState(repos || []);
  const flag = useRef();

  useEffect(() => {
    flag.current = true;
  }, []);

  useEffect(() => {
    if (flag.current) {
      flag.current = false;
      return;
    }
    getTrending(timePeriod).then(({ repos }) => {
      setLaterRepos([...repos]);
    });
  }, [timePeriod]);
  
  return (
    <>
      <h3>查看javascript的trending</h3>
      <div>
        <select
          value={timePeriod}
          onChange={e => setTimePeriod(e.target.value)}
        >
          <option value="daily">今日</option>
          <option value="weekly">本周</option>
          <option value="monthly">本月</option>
        </select>
      </div>
      <ul>
        {laterRepos.map(repo => (
          <li key={repo.name}>
            {repo.name} {repo.stars} ⭐️
          </li>
        ))}
      </ul>
    </>
  );
}

Home.getInitialProps = getTrending;

export default Home;
