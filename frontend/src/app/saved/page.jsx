"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trash2 } from "lucide-react";
import AuthButtons from "@/components/auth-buttons";
import { apiRequest } from "@/lib/queryClient";

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { isLoading: isLoadingUser } = useUser();

  const formatDateLabel = (value) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (isLoadingUser) return;
    const fetchSaved = async () => {
      try {
        const res = await apiRequest("GET", "/api/saved");
        const data = await res.json();
        const items = (data.items || []).map((item) => ({
          ...item,
          sourceFile: item.source || "Unknown source",
          dateLabel: formatDateLabel(item.created_at),
        }));
        setQuestions(items);
      } catch (err) {
        if (err?.status === 401) {
          router.push(`/api/auth/login?returnTo=${encodeURIComponent("/saved")}`);
          return;
        }
        setError(err.message || "Unable to load saved questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [isLoadingUser, router]);

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const filteredQuestions = (activeTab === "all"
    ? questions
    : questions.filter((q) => q.mode === activeTab)
  ).map((q) => ({
    ...q,
    dateLabel: q.dateLabel || formatDateLabel(q.created_at),
  }));

  const groupedByDate = filteredQuestions.reduce((acc, question) => {
    const label = question.dateLabel || "Unknown date";
    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(question);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold tracking-tight">Question Generator</h1>
          </div>
          <AuthButtons returnTo="/saved" />
        </div>
      </header>

      <main className="flex-1 px-6 md:px-8 lg:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Saved Questions</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              All your saved practice questions in one place
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-4" data-testid="text-error">
              {error}
            </p>
          )}

          {loading ? (
            <div className="text-center py-16 text-muted-foreground" data-testid="loading">
              Loading saved questions...
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all" className="flex-1 md:flex-none" data-testid="tab-all">
                  All Questions
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex-1 md:flex-none" data-testid="tab-notes">
                  Notes Mode
                </TabsTrigger>
                <TabsTrigger value="exam" className="flex-1 md:flex-none" data-testid="tab-exam">
                  Exam Mode
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-8">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Saved Questions</h3>
                    <p className="text-muted-foreground mb-6">
                      Start generating questions and save the ones you like
                    </p>
                    <Link href="/">
                      <Button data-testid="button-start-generating">
                        Start Generating Questions
                      </Button>
                    </Link>
                  </div>
                ) : (
                  Object.entries(groupedByDate).map(([date, dateQuestions]) => (
                    <div key={date}>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                        {date.toUpperCase()}
                      </h3>
                      <div className="space-y-4">
                        {dateQuestions.map((question) => (
                          <Card
                            key={question.id}
                            className="p-6"
                            data-testid={`card-question-${question.id}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {question.mode === "notes" ? "Notes" : "Exam"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {question.sourceFile}
                                  </span>
                                </div>
                                <p className="text-lg leading-relaxed">{question.question}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteQuestion(question.id)}
                                data-testid={`button-delete-${question.id}`}
                              >
                                <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
