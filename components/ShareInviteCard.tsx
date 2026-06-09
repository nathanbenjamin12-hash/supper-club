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
          <LinkIcon className="h-5 w-5 text-clay" aria-hidden="true" />
          Share invite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-oat/50 p-3 text-sm font-medium text-ink/70 break-all">
          {invitePath}
        </div>
        <Button type="button" onClick={copyInvite} className="mt-3 w-full" variant="clay">
          {message ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          Copy invite link
        </Button>
        {message ? <p className="mt-2 text-sm font-semibold text-sage">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
