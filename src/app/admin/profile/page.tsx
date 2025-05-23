"use client";

import ProfileModal from "@/components/admin-ui/profile/profile-modal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/profile-store";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal-store";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Shield, Lock, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { setOpen } = useModalStore();
  const { data: session } = useSession();
  const { profile, fetchProfile, loading, error, updateProfile } = useProfileStore();
  const { t } = useTranslation();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session, fetchProfile]);

  if (error) {
    toast.error(error);
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword) {
      toast.error(t("messages.error.profile.current-password-required"));
      return;
    }
    if (!passwordData.newPassword) {
      toast.error(t("messages.error.profile.new-password-required"));
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t("messages.error.profile.passwords-dont-match"));
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error(t("messages.error.profile.password-too-short"));
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await updateProfile({
        ...profile,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(t("messages.success.profile.password-updated"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("[UPDATE_PASSWORD_ERROR]", err);
      toast.error(t("messages.error.profile.password-update-failed"));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="h-full flex-1 overflow-auto p-4">
      <div className="container mx-auto px-4 md:px-6">
        <div className="py-4 pl-2 flex justify-between items-center">
          <h3 className="text-2xl font-bold tracking-tight">{t("components.admin-ui.profile.profile-page.title")}</h3>
          <Button 
            variant="outline" 
            className="bg-primary text-white hover:bg-primary/90 hover:text-white cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {t("components.admin-ui.profile.profile-page.edit-profile")}
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">{t("components.admin-ui.profile.profile-page.personal-info.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              renderSkeleton()
            ) : !profile ? (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground px-10 py-20">
                <span className="text-lg font-semibold">{t("components.admin-ui.profile.profile-page.personal-info.no-profile")}</span>
                <p className="text-sm mt-1">{t("components.admin-ui.profile.profile-page.personal-info.try-later")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    {t("components.admin-ui.profile.profile-page.personal-info.full-name")}
                  </div>
                  <p className="text-sm border rounded-md p-2">{profile.name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {t("components.admin-ui.profile.profile-page.personal-info.email")}
                  </div>
                  <p className="text-sm border rounded-md p-2">{profile.email}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {t("components.admin-ui.profile.profile-page.personal-info.phone")}
                  </div>
                  <p className="text-sm border rounded-md p-2">{profile.phone}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    {t("components.admin-ui.profile.profile-page.personal-info.role")}
                  </div>
                  <p className="text-sm border rounded-md p-2 capitalize">{profile.role}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t("components.admin-ui.profile.profile-page.change-password.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t("components.admin-ui.profile.profile-page.change-password.current-password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder={t("components.admin-ui.profile.profile-page.change-password.current-password-placeholder")}
                    required
                    className="w-full pl-9 focus-visible:ring-1 shadow-none"
                    disabled={isUpdatingPassword}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("components.admin-ui.profile.profile-page.change-password.new-password")}</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder={t("components.admin-ui.profile.profile-page.change-password.new-password-placeholder")}
                    required
                    className="w-full pl-9 focus-visible:ring-1 shadow-none"
                    disabled={isUpdatingPassword}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("components.admin-ui.profile.profile-page.change-password.confirm-password")}</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder={t("components.admin-ui.profile.profile-page.change-password.confirm-password-placeholder")}
                    required
                    className="w-full pl-9 focus-visible:ring-1 shadow-none"
                    disabled={isUpdatingPassword}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/90 dark:bg-gray-800 dark:text-white cursor-pointer"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? t("components.admin-ui.profile.profile-page.change-password.updating") : t("components.admin-ui.profile.profile-page.change-password.update-password")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <ProfileModal />
      </div>
    </section>
  );
};

export default SettingsPage;
