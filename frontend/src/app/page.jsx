"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap, ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight">StudyBot</h1>
          <Link href="/saved">
            <Button variant="ghost" data-testid="link-saved-questions">
              Saved Questions
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-background to-primary/5">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-14 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  AI-Powered Question Generation
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
                  Turn your notes and exams into practice questions—fast.
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                  Upload your study materials, get exam-style questions, and stay on top of every topic with tailored practice.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/notes">
                    <Button size="lg" className="gap-2" data-testid="cta-notes">
                      Start with Notes <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/exam">
                    <Button size="lg" variant="outline" className="gap-2" data-testid="cta-exam">
                      Try Exam Mode <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <Card className="p-6 md:p-8 hover-elevate transition-all duration-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">How it works</p>
                    <h3 className="text-xl font-semibold">Upload → Match → Generate</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      We embed your notes and find the most relevant chunks before drafting exam-style questions and answers.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="p-4 border-dashed">
                    <p className="text-xs text-muted-foreground mb-1">01</p>
                    <p className="font-semibold">Upload notes or exams</p>
                    <p className="text-sm text-muted-foreground mt-1">PDF, DOCX, or TXT—drag & drop to get started.</p>
                  </Card>
                  <Card className="p-4 border-dashed">
                    <p className="text-xs text-muted-foreground mb-1">02</p>
                    <p className="font-semibold">Generate tailored questions</p>
                    <p className="text-sm text-muted-foreground mt-1">We return a focused set of exam-style prompts with answers.</p>
                  </Card>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              className="min-h-80 p-8 md:p-10 flex flex-col hover-elevate transition-all duration-200"
              data-testid="card-notes-mode"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.08em]">Notes Mode</p>
                  <h3 className="text-2xl font-semibold">Turn notes into practice</h3>
                </div>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground mb-8 flex-1">
                Upload your notes to create focused practice questions that mirror your study material.
              </p>
              <Link href="/notes" className="w-full">
                <Button className="w-full" size="lg" data-testid="button-notes-mode">
                  Start with Notes
                </Button>
              </Link>
            </Card>

            <Card
              className="min-h-80 p-8 md:p-10 flex flex-col hover-elevate transition-all duration-200"
              data-testid="card-exam-mode"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.08em]">Exam Mode</p>
                  <h3 className="text-2xl font-semibold">Match prior exam style</h3>
                </div>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground mb-8 flex-1">
                Upload past exams to generate similar questions with comparable difficulty and coverage.
              </p>
              <Link href="/exam" className="w-full">
                <Button className="w-full" size="lg" data-testid="button-exam-mode">
                  Start with Exam
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
