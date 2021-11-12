import { useMemo, useState } from "react";
import Input from "./Input";
import Button from "./Button";

async function createSlug(url: string): Promise<string> {
  const response = await fetch(
    "https://shortr-worker.twhitbeck.workers.dev/create",
    {
      method: "POST",
      body: url,
    }
  );

  if (!response.ok) {
    throw new Error(`Bad Response: ${response.status} ${response.statusText}`);
  }

  const slug = await response.text();

  return slug;
}

export default function UrlForm({
  url,
  onCreateFulfilled,
  onCreateRejected,
  onUrlChange,
}: {
  url: string;
  onCreateFulfilled: (slug: string) => void;
  onCreateRejected: (error: Error) => void;
  onUrlChange: (url: string) => void;
}) {
  const [showError, setShowError] = useState(false);
  const isUrlValid = useMemo(() => {
    try {
      new URL(url);

      return true;
    } catch {
      return false;
    }
  }, [url]);

  return (
    <>
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();

          setShowError(true);

          if (!isUrlValid) {
            return;
          }

          createSlug(url).then(onCreateFulfilled, onCreateRejected);
        }}
      >
        <Input
          className="flex-grow"
          type="text"
          value={url}
          onChange={(e) => {
            setShowError(false);

            onUrlChange(e.target.value);
          }}
          placeholder="Enter your long url..."
          autoFocus
          aria-invalid={showError && !isUrlValid ? true : undefined}
        />

        <Button disabled={!isUrlValid}>Shorten</Button>
      </form>

      {showError && !isUrlValid && (
        <p className="mt-2 text-red-700" role="alert">
          Invalid url
        </p>
      )}
    </>
  );
}
