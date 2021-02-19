import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/link-error';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { createUploadLink } from 'apollo-upload-client';
import withApollo from 'next-with-apollo';
import { endpoint, prodEndpoint } from '../config';
import paginationField from './paginationField';

function createClient({ headers, initialState }) {
  return new ApolloClient({
    link: ApolloLink.from([
      // error handling link
      onError(({ graphQLErrors, networkError }) => {
        // error coming from bad request
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        // network issue, CORS error, forget to start the back end (Wes' most common error)
        if (networkError)
          console.log(
            `[Network error]: ${networkError}. Backend is unreachable. Is it running?`
          );
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      // apollo-upload-client supplements apollo-link-http
      createUploadLink({
        // process.env from config.js, which has public variables
        uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
        fetchOptions: {
          credentials: 'include',
        },
        // pass the headers along from this request. This enables SSR with logged in state
        headers,
      }),
    ]),
    // where will cache be stored? in browser is common, keeps until refresh
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // TODO: We will add this together!
            allProducts: paginationField(),
          },
        },
      },
      // because we are initially rendering views on server, all data collected on server apollo
      // client needs to be given to hydration on client
    }).restore(initialState || {}),
  });
}

// with-apollo lets us crawl all pages & components & look for queries we have & have fetched all that data
// before HTML renders, thus getDataFromTree
export default withApollo(createClient, { getDataFromTree });
