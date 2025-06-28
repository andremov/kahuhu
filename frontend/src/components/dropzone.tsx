import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Quiz } from '../utils/types';
import { v4 } from 'uuid';

interface DropzoneProps {
  onQuizAdded: (quiz: Quiz) => void;
  existingQuizIds: string[];
  className?: string;
}

export function Dropzone({ onQuizAdded, existingQuizIds, className = '' }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateQuiz = (quiz: unknown): quiz is Quiz => {
    if (!quiz || typeof quiz !== 'object') return false;
    const quizObj = quiz as Record<string, unknown>;

    if (typeof quizObj.title !== 'string' || !quizObj.title.trim()) return false;
    if (typeof quizObj.description !== 'string') return false;
    if (!Array.isArray(quizObj.questions)) return false;

    return quizObj.questions.every((q: unknown) => {
      if (!q || typeof q !== 'object') return false;
      const questionObj = q as Record<string, unknown>;

      return (
        typeof questionObj.statement === 'string' &&
        questionObj.statement.trim() &&
        Array.isArray(questionObj.options) &&
        questionObj.options.length >= 2 &&
        questionObj.options.every((opt: unknown) => {
          if (!opt || typeof opt !== 'object') return false;
          const optionObj = opt as Record<string, unknown>;
          return (
            typeof optionObj.text === 'string' &&
            optionObj.text.trim() &&
            typeof optionObj.points === 'number'
          );
        }) &&
        typeof questionObj.timeLimit === 'number' &&
        questionObj.timeLimit > 0
      );
    });
  };

  const processFile = async (file: File) => {
    try {
      if (!file.name.endsWith('.json')) {
        throw new Error('Please upload a JSON file');
      }

      const text = await file.text();
      const quizData = JSON.parse(text);

      if (!validateQuiz(quizData)) {
        throw new Error(
          'Invalid quiz format. Please ensure the file contains a valid quiz structure.'
        );
      }

      const newQuiz: Quiz = {
        title: quizData.title,
        description: quizData.description,
        id: quizData.id && !existingQuizIds.includes(quizData.id) ? quizData.id : v4(),
        questions: quizData.questions.map((q: unknown) => {
          const question = q as Record<string, unknown>;
          return {
            statement: question.statement as string,
            options: question.options as Quiz['questions'][0]['options'],
            timeLimit: question.timeLimit as number,
            id: (question.id as string) || v4(),
          };
        }),
      };

      onQuizAdded(newQuiz);
      setUploadError(null);
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to process file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFiles = files.filter((file) => file.name.endsWith('.json'));

    if (jsonFiles.length === 0) {
      setUploadError('Please drop JSON files only');
      return;
    }

    // Process all JSON files
    for (const file of jsonFiles) {
      await processFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      await processFile(file);
    }

    // Reset the input
    e.target.value = '';
  };

  return (
    <div
      className={`p-2 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm transition-all duration-200 ${
        isDragOver ? 'ring-2 ring-purple-400 ring-offset-2 bg-purple-50/95' : ''
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`border-dashed border-2 rounded-2xl p-8 transition-colors duration-200 ${
          isDragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300'
        }`}
      >
        <div className="text-center">
          <Upload
            className={`mx-auto h-12 w-12 mb-4 ${isDragOver ? 'text-purple-500' : 'text-gray-400'}`}
          />
          <p
            className={`text-lg font-medium mb-2 ${
              isDragOver ? 'text-purple-700' : 'text-gray-700'
            }`}
          >
            {isDragOver ? 'Drop your quiz files here' : 'Drag & drop quiz files here'}
          </p>
          <p className="text-sm text-gray-500 mb-4">or click to select files (JSON format only)</p>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".json"
            multiple
            onChange={handleFileInput}
          />
          <Button
            variant="secondary"
            onClick={() => document.getElementById('fileInput')?.click()}
            className="mx-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Files
          </Button>
        </div>
      </div>
      {uploadError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {uploadError}
        </div>
      )}
    </div>
  );
}
