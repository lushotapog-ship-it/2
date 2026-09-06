import topicCategories from '../data/topics.json';

export const TOPIC_CATEGORIES = topicCategories;

export const ALL_TOPICS = topicCategories.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, categoryLetter: cat.letter, categoryZh: cat.zh, categoryEn: cat.en })),
);

export function topicKey(topic) {
  return `${topic.categoryLetter}:${topic.en}`;
}

export function randomTopic(categoryLetters) {
  const pool = categoryLetters && categoryLetters.length ? ALL_TOPICS.filter((t) => categoryLetters.includes(t.categoryLetter)) : ALL_TOPICS;
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
