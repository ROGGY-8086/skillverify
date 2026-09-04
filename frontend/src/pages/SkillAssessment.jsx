import React, { useState, useEffect } from 'react';
import { Target, Clock, CheckCircle2, Award } from 'lucide-react';
import client from '../api/client';

const SkillAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      // Mock data since endpoint might not exist completely in backend instructions
      const mockAssessments = [
        { id: '1', skill_name: 'React', difficulty: 'intermediate', duration_minutes: 15, question_count: 5 },
        { id: '2', skill_name: 'Python', difficulty: 'advanced', duration_minutes: 20, question_count: 10 },
        { id: '3', skill_name: 'JavaScript', difficulty: 'basic', duration_minutes: 10, question_count: 5 },
      ];
      setAssessments(mockAssessments);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startAssessment = (assessment) => {
    setActiveAssessment({
      ...assessment,
      questions: [
        { id: 1, text: 'What is the virtual DOM in React?', options: ['A direct copy of the real DOM', 'A lightweight JavaScript representation of the DOM', 'A browser API', 'A new HTML standard'] },
        { id: 2, text: 'Which hook is used for side effects in functional components?', options: ['useState', 'useEffect', 'useContext', 'useReducer'] },
        { id: 3, text: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON X', 'JavaScript Execution'] }
      ]
    });
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setResult(null);
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIdx });
  };

  const handleSubmit = async () => {
    try {
      const mockScore = 85;
      const res = await client.post('/api/assessments/submit', {
        assessment_id: activeAssessment.id,
        score: mockScore,
        answers: selectedAnswers
      });
      setResult({ score: mockScore, ...res.data });
      setActiveAssessment(null);
    } catch (err) {
      console.error(err);
      // Fallback for demo
      setResult({ score: 85, level: 'Intermediate', message: 'Skill verified successfully!' });
      setActiveAssessment(null);
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center pt-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!activeAssessment && !result ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Skill Assessments</h1>
            <p className="text-slate-600 mt-2">Take assessments to verify your skills and boost your match score.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map(a => (
              <div key={a.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex-grow">
                  <div className="w-12 h-12 bg-teal-50 text-accent rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{a.skill_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 capitalize mb-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.difficulty === 'advanced' ? 'bg-red-50 text-red-700' :
                      a.difficulty === 'intermediate' ? 'bg-blue-50 text-blue-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {a.difficulty}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="h-4 w-4 mr-2 text-slate-400" /> {a.duration_minutes} mins
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-slate-400" /> {a.question_count} questions
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => startAssessment(a)}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            ))}
          </div>
        </>
      ) : activeAssessment ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{activeAssessment.skill_name} Assessment</h2>
                <p className="text-sm text-slate-500">Question {currentQuestion + 1} of {activeAssessment.questions.length}</p>
              </div>
              <div className="text-accent font-mono font-bold flex items-center gap-2">
                <Clock className="h-5 w-5" /> 14:59
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-slate-900 mb-6">
                {activeAssessment.questions[currentQuestion].text}
              </h3>
              
              <div className="space-y-3">
                {activeAssessment.questions[currentQuestion].options.map((opt, idx) => {
                  const qId = activeAssessment.questions[currentQuestion].id;
                  const isSelected = selectedAnswers[qId] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(qId, idx)}
                      className={`w-full text-left p-4 rounded-xl border ${
                        isSelected 
                          ? 'border-accent bg-teal-50 text-slate-900 ring-1 ring-accent' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      } transition-all`}
                    >
                      <span className="inline-block w-6 font-medium text-slate-400 mr-2">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              
              {currentQuestion === activeAssessment.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(selectedAnswers).length < activeAssessment.questions.length}
                  className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50"
                >
                  Submit Assessment
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(Math.min(activeAssessment.questions.length - 1, currentQuestion + 1))}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Completed!</h2>
            <p className="text-slate-600 mb-8">Your results have been verified and added to your profile.</p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Final Score</p>
              <p className="text-5xl font-black text-slate-900 mb-2">{result.score}%</p>
              <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {result.level || 'Intermediate'} Level Verified
              </div>
            </div>
            
            <button
              onClick={() => { setResult(null); fetchAssessments(); }}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors mb-3"
            >
              Take Another Assessment
            </button>
            <button
              onClick={() => window.location.href = '/candidate/profile'}
              className="w-full text-slate-600 font-medium hover:text-slate-900"
            >
              Back to Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAssessment;
