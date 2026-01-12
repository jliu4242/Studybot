"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Question Generator
          </h1>
          <Link href="/saved">
            <Button variant="ghost" data-testid="link-saved-questions">
              Saved Questions
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 md:px-8 lg:px-12 py-12">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Choose Your Mode
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Generate practice questions from your notes or create similar
              exam-style questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              className="min-h-80 p-8 md:p-12 flex flex-col items-center text-center hover-elevate transition-all duration-200"
              data-testid="card-notes-mode"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Notes Mode</h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-8 flex-1">
                Upload your point-form notes and generate practice questions
                based on the content. Perfect for studying and reinforcing key
                concepts.
              </p>
              <Link href="/notes" className="w-full">
                <Button className="w-full" size="lg" data-testid="button-notes-mode">
                  Start with Notes
                </Button>
              </Link>
            </Card>

            <Card
              className="min-h-80 p-8 md:p-12 flex flex-col items-center text-center hover-elevate transition-all duration-200"
              data-testid="card-exam-mode"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Exam Mode</h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-8 flex-1">
                Upload past exam questions and generate similar questions with
                matching difficulty and knowledge requirements.
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
