"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
  getLocalProgress,
  getOverallStatistics,
  syncStudentDataToDatabase,
  LessonProgressState,
} from "@/lib/progress/tracker";
import { COURSES } from "@/lib/data/courses";
import {
  User,
  Mail,
  LogOut,
  Trophy,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string | null;
    displayName: string;
    avatarUrl: string | null;
    createdAt: string | null;
    provider: string;
  } | null>(null);

  const [progress, setProgress] = useState<LessonProgressState | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        const meta = authUser.user_metadata || {};
        const provider =
          authUser.identities?.[0]?.provider || "email";
        setUser({
          email: authUser.email || null,
          displayName:
            meta.full_name ||
            meta.name ||
            (authUser.email ? authUser.email.split("@")[0] : "Learner"),
          avatarUrl: meta.avatar_url || meta.picture || null,
          createdAt: authUser.created_at || null,
          provider,
        });
      } else {
        // Not authenticated — show guest view
        setUser({
          email: null,
          displayName: "Guest Learner",
          avatarUrl: null,
          createdAt: null,
          provider: "guest",
        });
      }
      setIsLoading(false);
    });

    syncStudentDataToDatabase().then((synced) => {
      setProgress(synced);
    }).catch(() => {
      setProgress(getLocalProgress());
    });
  }, []);

  const stats = progress
    ? getOverallStatistics(progress)
    : {
        totalCompletedLessons: 0,
        totalLessonsAllCourses: 0,
        totalPassedProofs: 0,
        totalProofsAllCourses: 0,
        enrolledCoursesCount: 0,
        overallMastery: 0,
        overallCompletion: 0,
      };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  const copyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const totalCoursesAvailable = COURSES.length;

  if (isLoading) {
    return (
      <AppShell>
        <div className="py-20 text-center text-zinc-500 text-sm">
          Loading profile...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-10 py-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
            <User className="w-3.5 h-3.5" />
            Learner Profile
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs">
          <CardContent className="p-6">
            <div className="flex items-start gap-5 flex-wrap sm:flex-nowrap">
              {/* Avatar */}
              <div className="relative shrink-0">
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-20 h-20 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xs">
                    <span className="text-3xl font-black text-white">
                      {user?.displayName?.charAt(0).toUpperCase() || "L"}
                    </span>
                  </div>
                )}
                {user?.provider === "google" && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">G</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {user?.displayName}
                  </h2>
                  {user?.provider !== "guest" && (
                    <Badge
                      variant="outline"
                      className="text-xs border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 mt-1"
                    >
                      {user?.provider === "google"
                        ? "Google Account"
                        : "Email Account"}
                    </Badge>
                  )}
                </div>

                {user?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{user.email}</span>
                    <button
                      onClick={copyEmail}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      title="Copy email"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {joinDate && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {joinDate}
                  </div>
                )}
              </div>

              {/* Sign Out */}
              {user?.provider !== "guest" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </Button>
              )}
            </div>

            {user?.provider === "guest" && (
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Sign in to sync your progress across devices and unlock your
                  full learning profile.
                </p>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm">
                  <Link href="/auth/sign-in">
                    Sign In / Create Account{" "}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Learning Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Lessons Completed",
                value: stats.totalCompletedLessons,
                total: stats.totalLessonsAllCourses,
                icon: BookOpen,
                color: "text-blue-600 dark:text-blue-400",
              },
              {
                label: "Proofs Passed",
                value: stats.totalPassedProofs,
                total: stats.totalProofsAllCourses,
                icon: ShieldCheck,
                color: "text-indigo-600 dark:text-indigo-400",
              },
              {
                label: "Courses Started",
                value: stats.enrolledCoursesCount,
                total: totalCoursesAvailable,
                icon: Trophy,
                color: "text-amber-500 dark:text-amber-400",
              },
            ].map((s) => (
              <Card
                key={s.label}
                className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 text-center space-y-1 shadow-xs"
              >
                <s.icon className={`w-5 h-5 mx-auto ${s.color}`} />
                <div className={`text-2xl font-black ${s.color}`}>
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {s.label}
                  {s.total > 0 && (
                    <span className="text-slate-400 dark:text-slate-600"> / {s.total}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Mastery Meter */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Overall Mastery
                </span>
              </div>
              <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                {stats.overallMastery}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(stats.overallMastery, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mastery is measured by Proof Challenge pass rate across all
              attempted lessons.
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: "Browse All Courses",
                description: `${totalCoursesAvailable} courses available`,
                href: "/courses",
                icon: BookOpen,
              },
              {
                label: "View Proof Ledger",
                description: `${stats.totalPassedProofs} proofs verified`,
                href: "/proofs",
                icon: ShieldCheck,
              },
              {
                label: "Progress Dashboard",
                description: "Track your learning journey",
                href: "/progress",
                icon: Trophy,
              },
              {
                label: "Return to Dashboard",
                description: "Back to your home base",
                href: "/dashboard",
                icon: CheckCircle2,
              },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-blue-500/40 transition-all cursor-pointer group shadow-xs">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 flex items-center justify-center transition-colors shrink-0">
                      <action.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
