import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells Apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // args will be first and skip values query is called with
      // cache will be existing Apollo cache
      // console.log({ existing, args, cache });
      const { skip, first } = args;
      // read number of items on page from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // Wes approach to below
      // if (items.length && items.length !== first && page === pages) {
      //   return items;
      // }
      if (items.length && items.length !== first && page !== pages) {
        return false;
      }
      // if there are items, return them from the cache
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the cache. Will send them to Apollo`
        // );
        return items;
      }
      return false; // fallback to network
      // first, asks read function for those items
      // can do one of two things
      // first, return the items because they are already in the cache
      // second, return false (and make a network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // runs when Apollo client comes back from network request with products
      // how items are added to cache
      // console.log(`merging items from the network, ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      // merged.push(incoming) does not just work
      // unless items are always fetched in order, need to put placeholders for 'previous' items that are not in cache
      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }
      // return the merged items from the cache
      return merged;
    },
  };
}
