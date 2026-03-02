"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap, ArrowRight, NotebookPen, Sparkles } from "lucide-react";
import AuthButtons from "@/components/auth-buttons";
import notesExample from "../../public/notes_example.png"

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight">StudyBot</h1>
          <div className="flex items-center gap-3">
            <Link href="/saved">
              <Button variant="ghost" data-testid="link-saved-questions">
                Saved Questions
              </Button>
            </Link>
            <AuthButtons returnTo="/" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-background to-primary/5">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-14 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
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

        <div className="border-t border-b bg-muted/40">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-14 md:py-16 grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Built for messy notes
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold leading-tight">
                From hand‑typed outlines to polished practice.
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                StudyBot is tuned for real student notes—the kind that mix bullets, sub‑bullets, and rough phrasing.
                We extract structure from dense outlines like the gemstone examples and turn them into clear, answerable questions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <NotebookPen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Understands hierarchy</p>
                    <p className="text-sm text-muted-foreground">
                      Bullets, sub‑bullets, and quick notes stay grouped so generated questions match your outline.
                    </p>
                  </div>
                </Card>
                <Card className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Cleans up typos</p>
                    <p className="text-sm text-muted-foreground">
                      Handles imperfect spelling like “diamon distribution” and still generates accurate prompts.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="overflow-hidden border bg-card shadow-sm">
                <div className="p-4 border-b bg-muted/60">
                  <p className="text-sm font-semibold text-muted-foreground">Example notes</p>
                  <p className="text-base font-semibold">Famous Gemstones outline</p>
                </div>
                <div className="p-4">
                  <img
                    src="notes_example.png"
                    alt="Screenshot of gemstone bullet-point notes"
                    className="w-full rounded-md border shadow-sm"
                  />
                </div>
              </Card>
              <p className="text-sm text-muted-foreground">
                Drop in PDFs, DOCX, or plain text—our parser keeps your structure intact so questions stay on-topic.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
