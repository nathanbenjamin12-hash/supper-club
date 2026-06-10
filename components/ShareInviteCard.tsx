"use client";

import { useState } from "react";
import { Check, Copy, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShareInviteCard({ eventId }: { eventId: string }) {
  const [message, setMessage] = useState("");
  const invitePath = `/event/${eventId}`;

  async function copyInvite() {
    const url = `${window.location.origin}${invitePath}`;

    if (!navigator.clipboard) {
      setMessage("Copy is not supported here. Select the link manually.");
      return;
    }

    await navigator.clipboard.writeText(url);
    setMessage("Invite link copied.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-olive" aria-hidden="true" />
          Share invite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="break-all rounded-lg bg-stone/70 p-3 text-sm font-medium text-ink/70">
          {invitePath}
        </div>
        <Button type="button" onClick={copyInvite} className="mt-3 w-full" variant="default">
          {message ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          Copy invite link
        </Button>
        {message ? <p className="mt-2 text-sm font-semibold text-olive">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
