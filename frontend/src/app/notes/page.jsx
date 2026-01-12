"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Sparkles, Bookmark, X, ChevronRight } from "lucide-react";

export default function NotesPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
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
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedQuestions([
        {
          id: 1,
          preview: "Explain the key differences between mitosis and meiosis...",
          text: "Explain the key differences between mitosis and meiosis, focusing on their purposes and outcomes. Include details about chromosome number changes and when each process occurs in organisms.",
        },
        {
          id: 2,
          preview: "What are the main phases of cellular respiration...",
          text: "What are the main phases of cellular respiration and where does each occur in the cell? Describe the inputs and outputs of glycolysis, the citric acid cycle, and the electron transport chain.",
        },
        {
          id: 3,
          preview: "Describe the role of DNA polymerase in DNA replication...",
          text: "Describe the role of DNA polymerase in DNA replication and explain why it can only add nucleotides in the 5' to 3' direction. Discuss how this directional constraint leads to continuous and discontinuous synthesis on the two strands.",
        },
        {
          id: 4,
          preview: "How does the structure of a phospholipid bilayer...",
          text: "How does the structure of a phospholipid bilayer contribute to the selective permeability of cell membranes? Explain the arrangement of hydrophilic heads and hydrophobic tails and how this affects the passage of different molecules.",
        },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleToggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const handleSaveQuestion = (questionId) => {
    console.log("Saving question:", questionId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center px-6 md:px-8 lg:px-12">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold tracking-tight">
              Question Generator
            </h1>
            <Badge variant="secondary" className="ml-2">
              Notes Mode
            </Badge>
          </div>
          <div>
            <Link href="/saved">
                <Button variant="ghost" data-testid="link-saved-questions">
                Saved Questions
                </Button>
            </Link>
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
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {uploadedFiles.map((file, index) => (
              <Card key={index} className="p-4" data-testid={`card-file-${index}`}>
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
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
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

          {uploadedFiles.length > 0 && (
            <div className="p-6 border-t">
              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                data-testid="button-generate"
              >
                {isGenerating ? (
                  <>Generating Questions...</>
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
              <Button variant="outline" data-testid="button-save-all">
                <Bookmark className="w-4 h-4 mr-2" />
                Save All
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
                        >
                          <Bookmark className="w-4 h-4 md:mr-2" />
                          <span className="hidden md:inline">Save</span>
                        </Button>
                      </div>
                    </div>

                    <div className="px-6 md:px-12 py-8 md:py-16">
                      <div className="max-w-4xl mx-auto">
                        <p className="text-2xl md:text-4xl font-medium leading-relaxed mb-8">
                          {generatedQuestions.find((q) => q.id === expandedQuestion)?.text}
                        </p>

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
