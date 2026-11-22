import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Clock, ArrowLeft, ArrowRight, Send, AlertTriangle } from 'lucide-react';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);
  const totalDurationRef = useRef(0);

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/quizzes/${id}`);
        const loadedQuiz = res.data.quiz;
        setQuiz(loadedQuiz);

        const durationSeconds = (loadedQuiz.timeLimitMinutes || 10) * 60;
        totalDurationRef.current = durationSeconds;
        setTimeLeftSeconds(durationSeconds);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeftSeconds === null) return;

    if (timeLeftSeconds <= 0) {
      handleAutoSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeftSeconds]);

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const submitAnswers = async (isAuto = false) => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);

    const answersPayload = quiz.questions.map((q) => ({
      questionId: q._id,
      selectedOptionIndex:
        selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : null
    }));

    const timeSpent = totalDurationRef.current - (timeLeftSeconds || 0);

    try {
      const res = await api.post(`/quizzes/${id}/submit`, {
        answers: answersPayload,
        timeSpentSeconds: Math.max(0, timeSpent)
      });

      const submissionId = res.data.submissionId;
      navigate(`/results/${submissionId}`, { state: { result: res.data.result } });
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting quiz');
      setSubmitting(false);
    }
  };

  const handleManualSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalCount = quiz.questions.length;

    let confirmMsg = 'Are you ready to submit your answers?';
    if (answeredCount < totalCount) {
      confirmMsg = `You have answered ${answeredCount} of ${totalCount} questions. Submit now?`;
    }

    if (window.confirm(confirmMsg)) {
      submitAnswers(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your answers automatically.');
    submitAnswers(true);
  };

  if (loading) {
    return (
      <div className="workspace-wrapper">
        <Sidebar activeTab="library" />
        <main className="main-viewport" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading quiz session...</div>
        </main>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="workspace-wrapper">
        <Sidebar activeTab="library" />
        <main className="main-viewport">
          <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem 1.5rem', borderRadius: '8px' }}>
              {error || 'Quiz not found'}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const minutes = Math.floor((timeLeftSeconds || 0) / 60);
  const seconds = (timeLeftSeconds || 0) % 60;
  const isTimeCritical = timeLeftSeconds !== null && timeLeftSeconds < 60;

  const totalQuestions = quiz.questions.length;
  const currentProgressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="workspace-wrapper">
      {/* Sidebar Navigation matching Mockup Bottom-Right */}
      <Sidebar activeTab="library" />

      {/* Main Viewport */}
      <main className="main-viewport">
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          {/* Top Bar with Title, Progress Bar and Timer matching Mockup */}
          <div className="quiz-runner-header">
            {/* Left: Breadcrumb / Question Prompt */}
            <div className="quiz-runner-breadcrumb" title={currentQ?.questionText}>
              {currentQ?.questionText || quiz.title}
            </div>

            {/* Center: Teal Progress Bar (e.g. 7/20) */}
            <div className="quiz-progress-bar-wrap">
              <div className="progress-track">
                <div
                  className="progress-fill-teal"
                  style={{ width: `${currentProgressPercent}%` }}
                />
              </div>
              <span className="progress-counter">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>

            {/* Right: Remaining Timer Pill */}
            <div className={`quiz-timer-box ${isTimeCritical ? 'critical' : ''}`}>
              <Clock size={16} />
              <span>
                Remaining {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Centered Question Arena Card matching Mockup Bottom-Right */}
          <div className="question-arena-card">
            <h1 className="question-prompt-text">
              {currentQ.questionText}
            </h1>

            {/* Options Stack */}
            <div className="options-stack">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQ._id] === optIdx;

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ._id, optIdx)}
                    className={`option-row-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="option-radio-dot">
                      {isSelected && <div className="option-radio-inner" />}
                    </div>
                    <span className="option-label-text">{option}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls: Previous / Next matching Mockup Bottom-Right */}
          <div className="quiz-runner-nav-footer">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="btn-outline"
              style={{ opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="btn-navy"
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleManualSubmit}
                  disabled={submitting}
                  className="btn-teal"
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : 'Submit Quiz'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Index Dots for Quick Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            {quiz.questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q._id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={q._id}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isCurrent ? '2px solid var(--teal-primary)' : '1px solid var(--card-border)',
                    backgroundColor: isCurrent ? 'var(--teal-primary)' : isAnswered ? '#ccfbf1' : '#ffffff',
                    color: isCurrent ? '#ffffff' : isAnswered ? 'var(--teal-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TakeQuiz;
