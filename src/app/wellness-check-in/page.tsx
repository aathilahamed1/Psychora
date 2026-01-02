
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questionnaires, Answer } from '@/lib/questionnaires';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/contexts/i18n';
import { BackButton } from '@/components/back-button';

const phq9 = questionnaires['phq-9'];
const gad7 = questionnaires['gad-7'];
const allQuestions = [
  ...phq9.questions.map((q) => ({ text: q, source: 'PHQ-9' })),
  ...gad7.questions.map((q) => ({ text: q, source: 'GAD-7' })),
];
const totalQuestions = allQuestions.length;

export default function WellnessCheckinPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(totalQuestions).fill(null)
  );

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = parseInt(value, 10);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const phq9Score = answers
      .slice(0, phq9.questions.length)
      .reduce((sum, val) => sum + (val ?? 0), 0);
    const gad7Score = answers
      .slice(phq9.questions.length)
      .reduce((sum, val) => sum + (val ?? 0), 0);
      
    // Store results in localStorage to pass to the results page
    localStorage.setItem('wellnessResults', JSON.stringify({ phq9Score, gad7Score, date: new Date().toISOString() }));

    router.push('/wellness-check-in/results');
  };

  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answerOptions = currentQuestion.source === 'PHQ-9' ? phq9.answers : gad7.answers;
  const questionTitle = currentQuestion.source === 'PHQ-9' ? phq9.title : gad7.title;


  return (
    <div className="flex-1 p-4 sm:p-8 flex items-center justify-center relative">
      <BackButton />
      <Card className="w-full max-w-2xl glassmorphic-card">
        <CardHeader>
          <Progress value={progressPercentage} className="mb-4" />
          <CardTitle className="text-xl">
            {t('wellnessCheckin.title')}
          </CardTitle>
          <CardDescription>
            {t('wellnessCheckin.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              {t(questionTitle)}
            </p>
            <h2 className="text-2xl font-semibold">
              {currentQuestionIndex + 1}. {t(currentQuestion.text)}
            </h2>
          </div>
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={handleAnswerChange}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {answerOptions.map((answer) => (
              <Label
                key={answer.value}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-all cursor-pointer hover:bg-accent/50 ${
                  currentAnswer === answer.value
                    ? 'bg-accent border-primary shadow-inner'
                    : 'bg-transparent'
                }`}
              >
                <RadioGroupItem value={answer.value.toString()} id={`q${currentQuestionIndex}-a${answer.value}`} />
                <span>{t(answer.text)}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            {t('wellnessCheckin.previous')}
          </Button>
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button onClick={handleNext} disabled={currentAnswer === null}>
              {t('wellnessCheckin.next')}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={answers.some(a => a === null)}>
              {t('wellnessCheckin.submit')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
