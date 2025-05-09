import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "~/auth";
import { Button } from "~/components/ui/button";
import { ModeToggle } from "~/components/ui/mode-toggle";
import { Login, UserDropdown } from "~/features/login";
import type { UserWithKeys } from "~/types";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const user = session?.user as UserWithKeys;

  return (
    <div className="flex w-full">
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-6xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <main className="flex-auto">
          <div className="relative px-2 sm:px-8 lg:px-12">
            <div className="sm:px-8">
              <div className="mx-auto w-full max-w-7xl lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-5xl">
                  <div className="flex w-full items-start justify-between gap-4">
                    <div className="ml-2 flex w-full items-center justify-between gap-2 py-4 sm:ml-0 sm:px-4">
                      <Link href="/" className="flex items-center">
                        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                        <svg
                          className="-ml-3.5 h-7 w-7"
                          id="_8"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                        >
                          <path
                            className="h-5 w-5 fill-white dark:fill-zinc-900"
                            d="m231.16,159.49c0,20.71,0,31.07-3.53,42.22-4.43,12.17-14.02,21.76-26.19,26.19-11.15,3.53-21.5,3.53-42.22,3.53h-62.46c-20.71,0-31.06,0-42.21-3.53-12.17-4.43-21.76-14.02-26.19-26.19-3.53-11.15-3.53-21.5-3.53-42.22v-62.46c0-20.71,0-31.07,3.53-42.22,4.43-12.17,14.02-21.76,26.19-26.19,11.15-3.52,21.5-3.52,42.21-3.52h62.46c20.71,0,31.07,0,42.22,3.52,12.17,4.43,21.76,14.02,26.19,26.19,3.53,11.15,3.53,21.5,3.53,42.22v62.46Z"
                          />
                          <path
                            className="h-5 w-5 fill-primary"
                            d="m210.81,116.2v83.23c0,3.13-2.54,5.67-5.67,5.67h-68.04c-3.13,0-5.67-2.54-5.67-5.67v-15.5c.31-19,2.32-37.2,6.54-45.48,2.53-4.98,6.7-7.69,11.49-9.14,9.05-2.72,24.93-.86,31.67-1.18,0,0,20.36.81,20.36-10.72,0-9.28-9.1-8.55-9.1-8.55-10.03.26-17.67-.42-22.62-2.37-8.29-3.26-8.57-9.24-8.6-11.24-.41-23.1-34.47-25.87-64.48-20.14-32.81,6.24.36,53.27.36,116.05v8.38c-.06,3.08-2.55,5.57-5.65,5.57h-33.69c-3.13,0-5.67-2.54-5.67-5.67V55.49c0-3.13,2.54-5.67,5.67-5.67h31.67c3.13,0,5.67,2.54,5.67,5.67,0,4.65,5.23,7.24,9.01,4.53,11.39-8.16,26.01-12.51,42.37-12.51,36.65,0,64.36,21.36,64.36,68.69Zm-60.84-16.89c0-6.7-5.43-12.13-12.13-12.13s-12.13,5.43-12.13,12.13,5.43,12.13,12.13,12.13,12.13-5.43,12.13-12.13Z"
                          />
                          <rect
                            className="h-5 w-5 fill-white dark:fill-zinc-900"
                            width="256"
                            height="256"
                          />
                        </svg>
                        <h3 className="pr-2 font-bold font-mono text-sm dark:text-zinc-200">
                          no<span className="text-primary">_</span>strings
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2">
                        {user?.publicKey && (
                          <Link href="/post">
                            <Button size="sm" variant="outline">
                              Post
                            </Button>
                          </Link>
                        )}
                        <ModeToggle />
                        {user?.publicKey ? (
                          <UserDropdown publicKey={user?.publicKey} />
                        ) : (
                          <Login>{"Login"}</Login>
                        )}
                      </div>
                    </div>
                  </div>

                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
