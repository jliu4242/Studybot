"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Sparkles, Bookmark, X, ChevronRight, Loader2 } from "lucide-react";
import AuthButtons from "@/components/auth-buttons";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function parseQuestionsText(text) {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((q) => q.trim())
    .filter(Boolean)
    .map((q, idx) => ({
      id: idx + 1,
      preview: q.slice(0, 120) + (q.length > 120 ? "..." : ""),
      text: q,
    }));
}

const optionLineRegex = /^([A-D])[\).:\-]\s*(.+)$/i;

function parseQuestionWithOptions(text) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length) {
    return { prompt: text, options: [], correctLabel: null };
  }

  let correctLabel = null;
  const filteredLines = [];
  const correctAnswerRegex = /correct\s*answer[:\-\s]*([A-D])/i;

  lines.forEach((line) => {
    const match = line.match(correctAnswerRegex);
    if (match) {
      correctLabel = match[1].toUpperCase();
    } else {
      filteredLines.push(line);
    }
  });

  const optionStart = filteredLines.findIndex((line) => optionLineRegex.test(line));
  const prompt = optionStart > 0
    ? filteredLines.slice(0, optionStart).join(" ").trim()
    : filteredLines[0];

  const options = [];
  for (let i = optionStart >= 0 ? optionStart : 1; i < filteredLines.length; i += 1) {
    const match = filteredLines[i].match(optionLineRegex);
    if (match) {
      const rawText = match[2].trim();
      let choice = rawText;
      let explanation = "";
      const explMatch = rawText.match(/^(.*?)[\s]*[-:–—]\s+(.*)$/);
      if (explMatch && explMatch[2]) {
        choice = explMatch[1].trim();
        explanation = explMatch[2].trim();
      }
      options.push({ label: match[1].toUpperCase(), text: choice, explanation });
    }
  }

  return { prompt, options, correctLabel };
}

export default function NotesPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answeredOptions, setAnsweredOptions] = useState({});
  const router = useRouter();

  const cleanupEmbeddings = useCallback(async () => {
    const url = `${API_BASE}/notes/clear`;
    try {
      await apiRequest("POST", url);
    } catch {
      // ignore cleanup errors
    }
  }, []);

  const handleBack = async () => {
    await cleanupEmbeddings();
    router.push("/");
  };

  const uploadFileToBackend = async (item) => {
    console.log("[upload] start", { name: item.file.name, size: item.file.size });
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: "uploading", error: "" } : f))
    );

    try {
      const formData = new FormData();
      formData.append("file", item.file);
      console.log("1");
      const res = await apiRequest("POST", `${API_BASE}/notes/upload`, { body: formData });
      console.log("[upload] response", { name: item.file.name, status: res.status });
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "uploaded" } : f))
      );
    } catch (err) {
      console.error("[upload] failed", err);
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, status: "error", error: err.message || "Upload failed" } : f
        )
      );
      setError(err.message || "Upload failed");
    }
  };

  const enqueueFiles = (files) => {
    console.log("[enqueue] files", files.map((f) => ({ name: f.name, size: f.size })));
    const newItems = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      status: "uploading",
      error: "",
    }));
    setUploadedFiles((prev) => [...prev, ...newItems]);
    newItems.forEach(uploadFileToBackend);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    enqueueFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    enqueueFiles(files);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleGenerateQuestions = () => {
    const run = async () => {
      if (!uploadedFiles.length) {
        setError("Please upload at least one notes file (PDF, DOCX, or TXT).");
        return;
      }
      if (uploadedFiles.some((f) => f.status === "uploading")) {
        setError("Please wait for all uploads to finish.");
        return;
      }
      if (uploadedFiles.every((f) => f.status === "error")) {
        setError("All uploads failed. Please try again.");
        return;
      }
      if (!questionPrompt.trim()) {
        setError("Describe what kind of questions you want.");
        return;
      }
      if (!questionCount || Number.isNaN(Number(questionCount)) || Number(questionCount) <= 0) {
        setError("Choose how many questions to generate (must be at least 1).");
        return;
      }
      setError("");
      setGeneratedQuestions([]);
      setExpandedQuestion(null);
      setSelectedOptions({});
      setAnsweredOptions({});
      setIsGenerating(true);
      try {
        const res = await apiRequest("POST", `${API_BASE}/questions/generate`, {
          data: {
            text: questionPrompt.trim(),
            numQuestions: Number(questionCount),
          },
        });
        const data = await res.json();
        setGeneratedQuestions(parseQuestionsText(data.res));
        setExpandedQuestion(null);
      } catch (err) {
        setError(err.message || "Something went wrong generating questions.");
      } finally {
        setIsGenerating(false);
      }
    };
    run();
  };

  const handleToggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const redirectToLogin = () => {
    window.location.href = `/api/auth/login?returnTo=${encodeURIComponent("/notes")}`;
  };

  const saveQuestionToApi = async (questionText) => {
    try {
      await apiRequest("POST", "/api/saved", {
        data: {
          question: questionText,
          mode: "notes",
          source: uploadedFiles[0]?.file?.name || "notes",
        },
      });

      toast({
        title: "Saved",
        description: "Question saved to your account.",
      });
      return true;
    } catch (err) {
      toast({
        title: "Save failed",
        description: err?.message || "Unable to save question.",
        variant: "destructive",
      });
      if (err?.status === 401) {
        redirectToLogin();
      }
      return false;
    }
  };

  const handleSaveQuestion = async (questionId) => {
    const question = generatedQuestions.find((q) => q.id === questionId);
    if (!question) return;
    setIsSaving(true);
    await saveQuestionToApi(question.text);
    setIsSaving(false);
  };

  const handleSaveAll = async () => {
    if (!generatedQuestions.length) return;
    setIsSaving(true);
    const results = await Promise.all(generatedQuestions.map((q) => saveQuestionToApi(q.text)));
    const successCount = results.filter(Boolean).length;
    if (successCount) {
      toast({
        title: "Saved questions",
        description: `Saved ${successCount} question${successCount === 1 ? "" : "s"}.`,
      });
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center px-6 md:px-8 lg:px-12">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-back"
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">
              Question Generator
            </h1>
            <Badge variant="secondary" className="ml-2">
              Notes Mode
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/saved">
                <Button variant="ghost" data-testid="link-saved-questions">
                Saved Questions
                </Button>
            </Link>
            <AuthButtons returnTo="/notes" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-1/2 lg:w-2/5 border-r flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">
              Sources
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload your notes to generate questions
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-2" data-testid="text-error">
                {error}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {uploadedFiles.map((item, index) => (
              <Card key={item.id} className="p-4" data-testid={`card-file-${index}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-medium truncate"
                        data-testid={`text-filename-${index}`}
                      >
                        {item.file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(item.file.size / 1024).toFixed(1)} KB
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.status === "uploaded" && "Uploaded"}
                        {item.status === "uploading" && "Uploading..."}
                        {item.status === "error" && (
                          <span className="text-red-600">Upload failed</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    data-testid={`button-remove-${index}`}
                    className="flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover-elevate"
              }`}
              data-testid="dropzone-upload"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="text-base font-medium mb-2">Add more files</p>
                <p className="text-sm text-muted-foreground mb-4">PDF, TXT, DOCX</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileUpload}
                  multiple
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" asChild data-testid="button-browse">
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 border-t space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="notes-question-prompt">
                What kind of questions do you want?
              </label>
              <textarea
                id="notes-question-prompt"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={3}
                placeholder="e.g., Generate conceptual questions about the diamond supply chain and market pricing."
                value={questionPrompt}
                onChange={(e) => setQuestionPrompt(e.target.value)}
              />
            </div>
            <div className="space-y-2 space-x-5">
              <label className="text-sm font-medium text-foreground" htmlFor="notes-question-count">
                Number of questions
              </label>
              <input
                id="notes-question-count"
                type="number"
                min={1}
                max={50}
                className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
              />
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="p-6 border-t">
              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerateQuestions}
                disabled={isGenerating || uploading}
                data-testid="button-generate"
              >
                {isGenerating || uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploading ? "Uploading..." : "Generating Questions..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Generated Questions
            </h2>
            {generatedQuestions.length > 0 && (
              <Button
                variant="outline"
                data-testid="button-save-all"
                onClick={handleSaveAll}
                disabled={isSaving}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save All"}
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-hidden flex relative">
            {generatedQuestions.length === 0 ? (
              <div className="flex items-center justify-center h-full w-full">
                <div className="text-center max-w-md px-6">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No questions yet</h3>
                  <p className="text-muted-foreground">
                    Upload your notes and click generate to create practice questions
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`overflow-y-auto p-6 space-y-3 border-r transition-all duration-300 ${
                    expandedQuestion ? "hidden md:block md:w-64 md:opacity-50" : "w-full md:w-2/5"
                  }`}
                  aria-hidden={expandedQuestion ? "true" : "false"}
                  inert={expandedQuestion ? "" : undefined}
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">QUESTIONS</h3>
                  </div>
                  {generatedQuestions.map((question, index) => (
                    <Card
                      key={question.id}
                      className={`cursor-pointer hover-elevate active-elevate-2 transition-all duration-200 ${
                        expandedQuestion === question.id ? "bg-primary/10 ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleToggleQuestion(question.id)}
                      data-testid={`card-question-${question.id}`}
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Q{index + 1}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium leading-snug line-clamp-2">
                          {question.preview}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>

                {expandedQuestion && (
                  <div className="absolute inset-0 md:relative md:flex-1 overflow-y-auto bg-card z-20 animate-in fade-in-50 slide-in-from-bottom-10 md:slide-in-from-right-10 duration-500">
                    <div className="sticky top-0 bg-card/98 backdrop-blur-md border-b z-10 px-6 md:px-8 py-4 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpandedQuestion(null)}
                            data-testid="button-close-detail"
                            className="flex-shrink-0"
                          >
                            <ArrowLeft className="w-5 h-5 md:hidden" />
                            <X className="w-5 h-5 hidden md:block" />
                          </Button>
                          <Badge variant="secondary" className="text-sm flex-shrink-0">
                            Question {generatedQuestions.findIndex((q) => q.id === expandedQuestion) + 1}
                          </Badge>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSaveQuestion(expandedQuestion)}
                          data-testid={`button-save-${expandedQuestion}`}
                          className="flex-shrink-0"
                          disabled={isSaving}
                        >
                          <Bookmark className="w-4 h-4 md:mr-2" />
                          <span className="hidden md:inline">Save</span>
                        </Button>
                      </div>
                    </div>

                    <div className="px-6 md:px-12 py-8 md:py-16">
                      <div className="max-w-4xl mx-auto">
                        {(() => {
                          const question = generatedQuestions.find((q) => q.id === expandedQuestion);
                          const parsed = parseQuestionWithOptions(question?.text || "");
                          const { options, correctLabel } = parsed;
                          const answeredMeta = answeredOptions[question?.id] || null;
                          const isAnswered = Boolean(answeredMeta);
                          const selectedIdx = answeredMeta?.selectedIndex;

                          return (
                            <>
                              <p className="text-2xl md:text-4xl font-medium leading-relaxed mb-6">
                                {parsed.prompt}
                              </p>

                              {options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                                  {options.map((opt, idx) => {
                                    const isSelected = selectedIdx === idx;
                                    const isCorrectChoice =
                                      correctLabel &&
                                      opt.label.toUpperCase() === correctLabel.toUpperCase();
                                    const isCorrect = isAnswered && isCorrectChoice;
                                    const isWrong = isSelected && isAnswered && !isCorrectChoice;

                                    const classes = [
                                      "cursor-pointer border transition-all duration-150",
                                      isAnswered ? "pointer-events-none" : "hover:border-primary/60",
                                      isSelected ? "scale-[1.02]" : "",
                                      isCorrect ? "border-green-500 bg-green-50" : "",
                                      isWrong ? "border-red-500 bg-red-50" : "",
                                    ]
                                      .filter(Boolean)
                                      .join(" ");

                                    return (
                                      <Card
                                        key={`${question.id}-${opt.label}`}
                                        className={classes}
                                        onClick={() => {
                                          if (isAnswered) return;
                                          const isClickCorrect =
                                            correctLabel &&
                                            opt.label.toUpperCase() === correctLabel.toUpperCase();
                                          setSelectedOptions((prev) => ({ ...prev, [question.id]: idx }));
                                          setAnsweredOptions((prev) => ({
                                            ...prev,
                                            [question.id]: { selectedIndex: idx, isCorrect: !!isClickCorrect },
                                          }));
                                        }}
                                        data-testid={`option-${question.id}-${opt.label}`}
                                      >
                                        <div className="p-4 flex gap-3 items-start">
                                          <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                              isCorrect
                                                ? "bg-green-600 text-white"
                                                : isWrong
                                                  ? "bg-red-600 text-white"
                                                  : "bg-muted text-foreground"
                                            }`}
                                          >
                                            {opt.label}
                                          </div>
                                          <div className="text-sm leading-relaxed flex-1">
                                            <div className="font-medium">{opt.text}</div>
                                            {isAnswered && opt.explanation && (
                                              <p
                                                className={`mt-2 text-sm ${
                                                  isCorrect
                                                    ? "text-green-700"
                                                    : isWrong
                                                      ? "text-red-700"
                                                      : "text-muted-foreground"
                                                }`}
                                              >
                                                {opt.explanation}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </Card>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          );
                        })()}

                        <div className="mt-12 pt-8 border-t">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="outline"
                              className="flex-1 sm:flex-none"
                              onClick={() => {
                                const currentIndex = generatedQuestions.findIndex(
                                  (q) => q.id === expandedQuestion
                                );
                                if (currentIndex > 0) {
                                  setExpandedQuestion(generatedQuestions[currentIndex - 1].id);
                                }
                              }}
                              disabled={generatedQuestions.findIndex((q) => q.id === expandedQuestion) === 0}
                            >
                              Previous Question
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 sm:flex-none"
                              onClick={() => {
                                const currentIndex = generatedQuestions.findIndex(
                                  (q) => q.id === expandedQuestion
                                );
                                if (currentIndex < generatedQuestions.length - 1) {
                                  setExpandedQuestion(generatedQuestions[currentIndex + 1].id);
                                }
                              }}
                              disabled={
                                generatedQuestions.findIndex((q) => q.id === expandedQuestion) ===
                                generatedQuestions.length - 1
                              }
                            >
                              Next Question
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!expandedQuestion && (
                  <div className="flex-1 flex items-center justify-center bg-muted/10">
                    <div className="text-center max-w-md px-6">
                      <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
                        <ChevronRight className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3">
                        Select a question to view details
                      </h3>
                      <p className="text-muted-foreground text-base">
                        Click on any question from the list to see the full content and save it
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
