import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
  credentials: 'include',
});

// 認証トークンを追加するミドルウェアリンク
const authLink = setContext(async (_, { headers }) => {
  try {
    // APIからトークンを取得
    const res = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    const token = data.token;

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token.value}` : '',
      },
    };
  } catch (error) {
    console.error('Error fetching token:', error);
    return { headers };
  }
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
};
