
import md5 from 'crypto-js/md5';

const APP_ID = '26024';
const SECURE_HASH = 'giPTmdFjOauZKOwkAFAmrMCGXm276sMu';

export interface Survey {
  id: string;
  payout: number;
  loi: string;
  conversion_rate: string;
  score: string;
  payout_publisher_usd: string;
  href: string;
}

export interface SurveyResponse {
  status: string;
  surveys: Survey[];
}

export async function fetchSurveys(
  userId: string,
  {
    birthday,
    gender,
    country,
    zip,
  }: { birthday: Date; gender: 'm' | 'f'; country: string; zip: string }
): Promise<Survey[]> {
  const day = birthday.getUTCDate().toString().padStart(2, '0');
  const month = (birthday.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = birthday.getUTCFullYear().toString();
  const secure = md5(`${userId}-${SECURE_HASH}`).toString();
  const agent = typeof navigator !== 'undefined' ? encodeURIComponent(navigator.userAgent) : '';
  const url = `https://live-api.cpx-research.com/api/get-surveys.php?app_id=${APP_ID}&ext_user_id=${userId}&subid_1=&subid_2=&output_method=api&ip_user=&user_agent=${agent}&limit=12&secure_hash=${secure}&main_info=true&birthday_day=${day}&birthday_month=${month}&birthday_year=${year}&gender=${gender}&user_country_code=${country}&zip_code=${zip}`;
  const res = await fetch(url);
  const json: SurveyResponse = await res.json();
  if (json.status === 'success') return json.surveys;
  return [];
}
