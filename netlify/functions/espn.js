const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const ALLOWED = /^[a-z0-9_.]+$/i;
const PATH_OK = /^(?:scoreboard|summary|teams\/\d+(?:\/(?:roster|injuries|schedule))?)$/;
exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const league = String(q.league || '');
  const path = String(q.path || '');
  if(!ALLOWED.test(league) || league.length > 50 || !PATH_OK.test(path)) {
    return {statusCode:400,body:JSON.stringify({error:'Parameter liga/path tidak valid'})};
  }
  const params = new URLSearchParams();
  for(const key of ['dates','event','limit']) if(q[key]) params.set(key,String(q[key]).slice(0,48));
  const url = `${BASE}/${encodeURIComponent(league)}/${path}${params.size ? '?'+params : ''}`;
  try {
    const response = await fetch(url,{headers:{'Accept':'application/json'},signal:AbortSignal.timeout(14000)});
    const body = await response.text();
    return {
      statusCode:response.status,
      headers:{'Content-Type':'application/json; charset=utf-8',
        'Cache-Control':path==='scoreboard' ? 'public, max-age=30, s-maxage=60' : 'public, max-age=60, s-maxage=120'},
      body
    };
  } catch(error) {
    return {statusCode:502,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'ESPN tidak dapat dihubungi',detail:error.message})};
  }
};
