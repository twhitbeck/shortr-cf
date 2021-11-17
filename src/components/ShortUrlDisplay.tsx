import React, { useEffect, useState } from "react";

import Input from "./Input";
import Button from "./Button";

export default function ShortUrlDisplay({
  shortUrl,
  onBackClick,
}: {
  shortUrl: string;
  onBackClick: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <>
      <p className="mb-2">Your short url:</p>

      <div className="flex items-center gap-2 mb-2">
        <Input
          className="flex-grow"
          aria-label="Short url"
          readOnly
          defaultValue={shortUrl}
          onClick={(e) => {
            (e.target as HTMLInputElement).setSelectionRange(
              0,
              shortUrl.length
            );
          }}
        />
        <Button
          onClick={() => {
            navigator.clipboard.writeText(shortUrl).then(() => {
              setCopied(true);
            });
          }}
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <div className="i-heroicons-outline-clipboard-check" />
          ) : (
            <div className="i-heroicons-outline-clipboard" />
          )}
        </Button>
      </div>

      <button
        className="flex items-center hover:underline text-green-700 dark:text-green-500"
        onClick={() => {
          onBackClick();
        }}
      >
        <div className="i-heroicons-outline-reply scale-y-[-1] mr-2" />
        Shorten another url
      </button>
    </>
  );
}
