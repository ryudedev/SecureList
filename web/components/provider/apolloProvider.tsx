'use client';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@/lib/apolloClient';
import { useState, useEffect } from 'react';

export function ApolloProviders({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState(() => createApolloClient());

  useEffect(() => {
    // クライアントの再作成（トークンがリフレッシュされた場合など）
    setClient(createApolloClient());
  }, []); // 必要に応じてトリガー条件を追加

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
