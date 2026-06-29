import { useState } from "react";
import { useLocation } from "wouter";
import { Map, MapPin, User as UserIcon, LogOut, Award, Calendar, Edit2, X, Save, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [, setLocation] = useLocation();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const handleEdit = () => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSaving(true);
    try {
      await updateUser({ name: name.trim(), email: email.trim() });
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-primary" />
          My Profile
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          data-testid="btn-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase shrink-0">
              {getInitials(user.name)}
            </div>

            <div className="flex-1 w-full">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      data-testid="input-edit-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      data-testid="input-edit-email"
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      size="sm"
                      data-testid="btn-save-changes"
                    >
                      <Save className="w-4 h-4 mr-1.5" />
                      {saving ? "Saving…" : "Save Changes"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={saving}
                      data-testid="btn-cancel-edit"
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center md:text-left space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900" data-testid="text-user-name">
                        {user.name}
                      </h2>
                      <p className="text-gray-500" data-testid="text-user-email">
                        {user.email}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="shrink-0"
                      data-testid="btn-edit-profile"
                    >
                      <Edit2 className="w-4 h-4 mr-1.5" />
                      Edit
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </Badge>
                    <Badge className="px-3 py-1 bg-green-100 text-green-800 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {user.rewardPoints} Reward Points
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className="hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setLocation("/saved-trips")}
        >
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-1">Saved Trips</h3>
            <p className="text-xs text-gray-500">View your frequent routes</p>
          </CardContent>
        </Card>

        <Card
          className="hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setLocation("/planner")}
        >
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-1">Trip Planner</h3>
            <p className="text-xs text-gray-500">Plan a new journey</p>
          </CardContent>
        </Card>

        <Card
          className="hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setLocation("/rewards")}
        >
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-1">Rewards</h3>
            <p className="text-xs text-gray-500">Redeem your points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
