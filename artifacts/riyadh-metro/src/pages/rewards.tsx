import { useState } from "react";
import { useLocation } from "wouter";
import { Gift, Award, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { useAuth, type RedeemedReward } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  highlight: boolean;
}

const CATALOG: Reward[] = [
  {
    id: "free-ride-single",
    title: "Free Single Ride",
    description: "One complimentary journey on any Riyadh Metro line.",
    pointsCost: 50,
    category: "Travel",
    highlight: true,
  },
  {
    id: "free-ride-day-pass",
    title: "Day Pass",
    description: "Unlimited travel across all 6 lines for one day.",
    pointsCost: 150,
    category: "Travel",
    highlight: false,
  },
  {
    id: "coffee-discount",
    title: "10% Off at Station Cafes",
    description: "Discount at participating coffee shops inside metro stations.",
    pointsCost: 30,
    category: "Dining",
    highlight: false,
  },
  {
    id: "lounge-access",
    title: "Premium Lounge Access",
    description: "One-time entry to the KAFD Premium Traveller Lounge.",
    pointsCost: 200,
    category: "Premium",
    highlight: false,
  },
  {
    id: "priority-boarding",
    title: "Priority Boarding Pass",
    description: "Skip the queue at any interchange station, valid for one month.",
    pointsCost: 100,
    category: "Premium",
    highlight: false,
  },
  {
    id: "metro-tote-bag",
    title: "Riyadh Metro Tote Bag",
    description: "Exclusive branded tote bag available for pickup at KAFD station.",
    pointsCost: 80,
    category: "Merchandise",
    highlight: false,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Travel: "bg-blue-100 text-blue-700",
  Dining: "bg-orange-100 text-orange-700",
  Premium: "bg-purple-100 text-purple-700",
  Merchandise: "bg-teal-100 text-teal-700",
};

export default function Rewards() {
  const { user, redeemReward, getRedeemedRewards } = useAuth();
  const [, setLocation] = useLocation();
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [codeModal, setCodeModal] = useState<{ reward: Reward; entry: RedeemedReward } | null>(null);

  const redeemed = getRedeemedRewards();
  const redeemedIds = new Set(redeemed.map((r) => r.rewardId));

  const available = CATALOG.filter((r) => !redeemedIds.has(r.id));
  const alreadyRedeemed = CATALOG.filter((r) => redeemedIds.has(r.id));

  const handleRedeem = async (reward: Reward) => {
    if (!user) {
      toast.error("Please log in to redeem rewards");
      setLocation("/login");
      return;
    }
    if (redeemedIds.has(reward.id)) {
      const existing = redeemed.find((r) => r.rewardId === reward.id);
      if (existing) setCodeModal({ reward, entry: existing });
      return;
    }
    if (redeeming) return;

    setRedeeming(reward.id);
    try {
      const entry = await redeemReward(reward.id, reward.pointsCost);
      setCodeModal({ reward, entry });
    } catch (err: any) {
      toast.error(err.message || "Redemption failed. Please try again.");
    } finally {
      setRedeeming(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success("Code copied to clipboard");
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            Rewards
          </h1>
          <p className="text-gray-500 text-sm mt-1">Redeem your points for exclusive benefits.</p>
        </div>
        {user && (
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-semibold" data-testid="badge-reward-points">
            <Award className="w-4 h-4" />
            {user.rewardPoints} pts
          </div>
        )}
      </div>

      {!user && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Log in to redeem rewards</p>
              <p className="text-sm text-amber-700">Create an account to start earning and redeeming points.</p>
            </div>
            <Button size="sm" className="ml-auto shrink-0" onClick={() => setLocation("/login")} data-testid="btn-login-rewards">
              Log In
            </Button>
          </CardContent>
        </Card>
      )}

      {available.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-700">Available Rewards</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {available.map((reward) => {
              const isRedeeming = redeeming === reward.id;
              const canAfford = !user || user.rewardPoints >= reward.pointsCost;
              const catColor = CATEGORY_COLORS[reward.category] ?? "bg-gray-100 text-gray-600";

              return (
                <Card
                  key={reward.id}
                  className={`flex flex-col transition-shadow hover:shadow-md ${reward.highlight ? "border-primary/50" : ""}`}
                  data-testid={`card-reward-${reward.id}`}
                >
                  {reward.highlight && (
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-t-lg text-center tracking-wide">
                      POPULAR
                    </div>
                  )}
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{reward.title}</CardTitle>
                      <Badge className={`text-xs shrink-0 font-medium ${catColor}`} variant="outline">
                        {reward.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm mt-1">{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 mt-auto flex items-center justify-between gap-3">
                    <span className="font-bold text-primary text-sm">{reward.pointsCost} pts</span>
                    <Button
                      size="sm"
                      disabled={!user || isRedeeming || !canAfford}
                      onClick={() => handleRedeem(reward)}
                      data-testid={`btn-redeem-${reward.id}`}
                    >
                      {isRedeeming
                        ? "Redeeming…"
                        : !canAfford
                        ? "Not enough points"
                        : "Redeem"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {alreadyRedeemed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-700">Already Redeemed</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {alreadyRedeemed.map((reward) => {
              const entry = redeemed.find((r) => r.rewardId === reward.id)!;
              return (
                <Card key={reward.id} className="opacity-70" data-testid={`card-redeemed-${reward.id}`}>
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{reward.title}</p>
                        <p className="text-xs text-gray-400">
                          Redeemed {new Date(entry.redeemedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs shrink-0"
                      onClick={() => setCodeModal({ reward, entry })}
                      data-testid={`btn-show-code-${reward.id}`}
                    >
                      Show Code
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {available.length === 0 && alreadyRedeemed.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-10 flex flex-col items-center text-center text-gray-400">
            <Gift className="w-10 h-10 mb-3" />
            <p className="font-medium">No rewards available right now</p>
            <p className="text-sm mt-1">Check back soon for new offers.</p>
          </CardContent>
        </Card>
      )}

      {/* Redemption code modal */}
      <Dialog open={!!codeModal} onOpenChange={(open) => { if (!open) setCodeModal(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Reward Redeemed
            </DialogTitle>
            <DialogDescription>
              Your redemption code for <strong>{codeModal?.reward.title}</strong> is below. Present this at the point of use.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3">
              <span
                className="font-mono text-lg font-bold tracking-widest text-gray-900"
                data-testid="text-redemption-code"
              >
                {codeModal?.entry.code}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => codeModal && copyCode(codeModal.entry.code)}
                data-testid="btn-copy-code"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Redeemed on{" "}
              {codeModal && new Date(codeModal.entry.redeemedAt).toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          </div>

          <DialogFooter>
            <Button className="w-full" onClick={() => setCodeModal(null)} data-testid="btn-close-code-modal">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
