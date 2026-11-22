import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { PlusCircle, Trash2, ArrowLeft, CheckCircle, AlertCircle, Clock, Award, HelpCircle } from 'lucide-react';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
    timeLimitMinutes: 10,
    passingScorePercent: 60
  });

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      points: 1,
      explanation: ''
    }
  ]);

  const handleDetailChange = (e) => {
    setQuizDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleQuestionTextChange = (qIndex, text) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].questionText = text;
      return updated;
    });
  };

  const handleOptionChange = (qIndex, optIndex, text) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].options[optIndex] = text;
      return updated;
    });
  };

  const handleCorrectOptionChange = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].correctOptionIndex = optIndex;
      return updated;
    });
  };

  const handlePointsChange = (qIndex, points) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].points = Math.max(1, parseInt(points) || 1);
      return updated;
    });
  };

  const handleExplanationChange = (qIndex, explanation) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].explanation = explanation;
      return updated;
    });
  };

  const addOption = (qIndex) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIndex].options.length < 6) {
        updated[qIndex].options.push('');
      }
      return updated;
    });
  };

  const removeOption = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIndex].options.length > 2) {
        updated[qIndex].options.splice(optIndex, 1);
        if (updated[qIndex].correctOptionIndex >= updated[qIndex].options.length) {
          updated[qIndex].correctOptionIndex = 0;
        }
      }
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        points: 1,
        explanation: ''
      }
    ]);
  };

  const removeQuestion = (qIndex) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!quizDetails.title.trim()) {
      setError('Quiz title is required');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text cannot be empty`);
        return;
      }
      const hasEmptyOption = q.options.some((opt) => !opt.trim());
      if (hasEmptyOption) {
        setError(`All options in Question ${i + 1} must be filled in`);
        return;
      }
    }

    setLoading(true);

    try {
      await api.post('/quizzes', {
        title: quizDetails.title,
        description: quizDetails.description,
        timeLimitMinutes: Number(quizDetails.timeLimitMinutes),
        passingScorePercent: Number(quizDetails.passingScorePercent),
        questions
      });

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-wrapper">
      {/* Sidebar Navigation */}
      <Sidebar activeTab="quizzes" />

      {/* Main Viewport */}
      <main className="main-viewport">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <Link to="/admin" className="btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeft size={14} />
              <span>Back to Admin Panel</span>
            </Link>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Quiz Editor Main Card matching Mockup Top-Right */}
          <div className="editor-main-card">
            <h1 className="editor-title">Quiz Editor</h1>

            <form onSubmit={handleSubmit}>
              {/* Quiz Title */}
              <div className="form-field">
                <label className="form-label-theme" htmlFor="title">Quiz Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  required
                  className="form-input-theme"
                  placeholder="e.g. History of Art"
                  value={quizDetails.title}
                  onChange={handleDetailChange}
                />
              </div>

              {/* Description */}
              <div className="form-field">
                <label className="form-label-theme" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="form-textarea-theme"
                  placeholder="Provide an overview of the concepts tested in this quiz..."
                  value={quizDetails.description}
                  onChange={handleDetailChange}
                />
              </div>

              {/* Duration & Passing Score */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="form-field">
                  <label className="form-label-theme" htmlFor="timeLimitMinutes" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} color="var(--teal-primary)" />
                    <span>Duration (Minutes)</span>
                  </label>
                  <input
                    id="timeLimitMinutes"
                    type="number"
                    name="timeLimitMinutes"
                    min={1}
                    max={180}
                    required
                    className="form-input-theme"
                    value={quizDetails.timeLimitMinutes}
                    onChange={handleDetailChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label-theme" htmlFor="passingScorePercent" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={15} color="var(--teal-primary)" />
                    <span>Passing Score (%)</span>
                  </label>
                  <input
                    id="passingScorePercent"
                    type="number"
                    name="passingScorePercent"
                    min={0}
                    max={100}
                    required
                    className="form-input-theme"
                    value={quizDetails.passingScorePercent}
                    onChange={handleDetailChange}
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="questions-section-header">
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Questions ({questions.length})
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Add multiple-choice questions and designate the correct answer.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn-navy btn-sm"
                >
                  <PlusCircle size={15} />
                  <span>Add Question</span>
                </button>
              </div>

              {/* Questions List */}
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="question-builder-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Question {qIndex + 1}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <label>Points:</label>
                        <input
                          type="number"
                          min={1}
                          value={q.points}
                          onChange={(e) => handlePointsChange(qIndex, e.target.value)}
                          className="form-input-theme"
                          style={{ width: '56px', padding: '0.25rem 0.4rem', textAlign: 'center', height: '32px' }}
                        />
                      </div>

                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="btn-danger-outline"
                          title="Remove Question"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="form-field" style={{ marginBottom: '0.85rem' }}>
                    <input
                      type="text"
                      required
                      placeholder={`Enter Question ${qIndex + 1} text...`}
                      className="form-input-theme"
                      value={q.questionText}
                      onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                    />
                  </div>

                  {/* Options List with radio check */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      Options (Click the radio button to designate the correct answer):
                    </label>

                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctOptionIndex === optIndex}
                          onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--teal-primary)' }}
                          title="Mark as correct answer"
                        />
                        <input
                          type="text"
                          required
                          placeholder={`Option ${optIndex + 1}`}
                          className="form-input-theme"
                          style={{ padding: '0.5rem 0.8rem', fontSize: '0.88rem' }}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        />
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, optIndex)}
                            className="btn-outline btn-sm"
                            style={{ padding: '0.4rem 0.6rem' }}
                            title="Remove Option"
                          >
                            <Trash2 size={13} color="#ef4444" />
                          </button>
                        )}
                      </div>
                    ))}

                    {q.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="btn-outline btn-sm"
                        style={{ marginTop: '0.35rem', fontSize: '0.78rem' }}
                      >
                        + Add Option
                      </button>
                    )}
                  </div>

                  {/* Explanation */}
                  <div>
                    <input
                      type="text"
                      placeholder="Explanation / review feedback for students (optional)..."
                      className="form-input-theme"
                      style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem' }}
                      value={q.explanation}
                      onChange={(e) => handleExplanationChange(qIndex, e.target.value)}
                    />
                  </div>
                </div>
              ))}

              {/* Bottom Actions matching Mockup (Cancel and Save | Publish) */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '2rem',
                borderTop: '1px solid var(--card-border)',
                paddingTop: '1.25rem'
              }}>
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-teal"
                  style={{ minWidth: '150px' }}
                >
                  <CheckCircle size={16} />
                  <span>{loading ? 'Saving...' : 'Save | Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;
