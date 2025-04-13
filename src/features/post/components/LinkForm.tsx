"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { usePostMutation } from "../hooks/usePostMutation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { UserWithKeys } from "~/types";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "At least one tag is required.",
  }),
});

export function LinkForm() {
  const router = useRouter();
  const user = useSession();
  const userWithKeys = user.data?.user as UserWithKeys;
  const postMutation = usePostMutation();



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      tags: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userWithKeys.publicKey || !userWithKeys.secretKey) {
      console.error("Missing public key or secret key");
      return;
    }

    postMutation.mutate(
      {
        title: values.title,
        url: values.url,
        content: "",
        tags: values.tags.map((tag) => ["t", tag]),
        publicKey: userWithKeys.publicKey,
        secretKey: userWithKeys.secretKey,
      },
      {
        onSuccess: () => {
          form.reset();
          router.push("/");
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter link title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tags separated by commas"
                  {...field}
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(",")
                      .map((tag) => tag.trim());
                    field.onChange(tags);
                  }}
                />
              </FormControl>
              <FormDescription>Separate tags with commas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={postMutation.isPending}>
          {postMutation.isPending ? "Posting..." : "Submit"}
        </Button>
        {postMutation.isError && (
          <p className="text-red-500 text-sm">
            Error posting: {postMutation.error.message}
          </p>
        )}
      </form>
    </Form>
  );
}
