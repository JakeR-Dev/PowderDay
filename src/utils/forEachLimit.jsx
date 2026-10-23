// helper to run an async callback over items with a max number running at once
// returning false from the callback stops any remaining items from starting
export default async function forEachLimit(items, limit, callback) {
  let nextIndex = 0;
  let stopped = false;

  const worker = async () => {
    while (!stopped && nextIndex < items.length) {
      const item = items[nextIndex++];
      if (await callback(item) === false) stopped = true;
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}
