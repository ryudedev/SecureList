'use client';
import { useState } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '@/graphql/mutations/auth';
import { useAuth } from '@/components/provider/authProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useForm } from 'react-hook-form';
import { authSchema } from '@/data/schema';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApolloError | null>(null);
  const { login } = useAuth();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      login(data.login.token);
      // router.push('/dashboard'); // ログイン後のリダイレクト先
    },
    onError: (error) => {
      setError(error);
    },
  });

  const handleSubmit = async () => {
    setError(null);

    try {
      await loginMutation({
        variables: {
          email,
          password,
        },
      });
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <Card className="w-[700px] pt-6">
      <Label className="text-muted-foreground text-sm pl-6">SecureList</Label>
      <CardHeader>
        <CardTitle>サインイン</CardTitle>
        <CardDescription>このサービスを利用するには、認証が必要です。以下の認証情報を正確に入力し、「認証する」ボタンをクリックしてください。</CardDescription>
      </CardHeader>
      <CardContent>
        <Label>{error && JSON.stringify(error, null, 2)}</Label>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="securelist@gmail.com"
                        {...field}
                        value={email}
                        onChange={(e) => {
                          field.onChange(e);
                          setEmail(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      メールアドレスを入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        value={password}
                        onChange={(e) => {
                          field.onChange(e);
                          setPassword(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      パスワードを入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button>サインイン</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
