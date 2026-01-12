"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trash2 } from "lucide-react";

const mockSavedQuestions = [
  {
    id: 1,
    mode: "notes",
    question:
      "Explain the key differences between mitosis and meiosis, focusing on their purposes and outcomes.",
    sourceFile: "Biology_Chapter_3.pdf",
    savedDate: "2024-01-15",
    dateLabel: "January 15, 2024",
  },
  {
    id: 2,
    mode: "notes",
    question:
      "What are the main phases of cellular respiration and where does each occur in the cell?",
    sourceFile: "Biology_Chapter_3.pdf",
    savedDate: "2024-01-15",
    dateLabel: "January 15, 2024",
  },
  {
    id: 3,
    mode: "exam",
    question:
      "A researcher is studying the effects of temperature on enzyme activity. Design an experiment to test how temperature affects the rate of catalase breaking down hydrogen peroxide. Include controls and identify independent and dependent variables.",
    sourceFile: "Midterm_Practice.pdf",
    savedDate: "2024-01-14",
    dateLabel: "January 14, 2024",
  },
  {
    id: 4,
    mode: "notes",
    question:
      "Describe the role of DNA polymerase in DNA replication and explain why it can only add nucleotides in the 5' to 3' direction.",
    sourceFile: "Genetics_Notes.txt",
    savedDate: "2024-01-14",
    dateLabel: "January 14, 2024",
  },
  {
    id: 5,
    mode: "exam",
    question:
      "Compare and contrast prokaryotic and eukaryotic cells. Your answer should include at least three structural differences and explain the functional significance of each.",
    sourceFile: "Final_Exam_2023.pdf",
    savedDate: "2024-01-12",
    dateLabel: "January 12, 2024",
  },
  {
    id: 6,
    mode: "exam",
    question:
      "A plant cell is placed in a hypertonic solution. Predict what will happen to the cell and explain your reasoning using the concepts of osmosis and water potential.",
    sourceFile: "Final_Exam_2023.pdf",
    savedDate: "2024-01-12",
    dateLabel: "January 12, 2024",
  },
  {
    id: 7,
    mode: "notes",
    question:
      "How does the structure of a phospholipid bilayer contribute to the selective permeability of cell membranes?",
    sourceFile: "Cell_Biology_Summary.docx",
    savedDate: "2024-01-10",
    dateLabel: "January 10, 2024",
  },
];

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [questions, setQuestions] = useState(mockSavedQuestions);

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const filteredQuestions =
    activeTab === "all" ? questions : questions.filter((q) => q.mode === activeTab);

  const groupedByDate = filteredQuestions.reduce((acc, question) => {
    if (!acc[question.dateLabel]) {
      acc[question.dateLabel] = [];
    }
    acc[question.dateLabel].push(question);
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
        </div>
      </main>
    </div>
  );
}
