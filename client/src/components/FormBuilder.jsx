import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import NestedQuestion from './NestedQuestion';
import { assignNumbers } from '../utils/autoNumbering';

const LOCAL_STORAGE_KEY = 'nested-form-builder';

function createEmptyQuestion() {
  return {
    id: Date.now().toString(),
    text: '',
    type: '',
    answer: null,
    children: [],
  };
}

export default function FormBuilder() {
  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(null);

  // load from localStorage (preferred) or backend on mount
  useEffect(() => {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setQuestions(parsed);
        return;
      } catch (e) {
        console.error('Failed to parse stored form', e);
      }
    }

    // fallback: fetch from backend API
    fetch('/api/form')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch form from backend', err);
      });
  }, []);

  // persist to localStorage and backend whenever questions change
  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
    fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questions),
    }).catch((err) => {
      console.error('Failed to save form to backend', err);
    });
  }, [questions]);

  const handleAddParent = useCallback(() => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  }, []);

  const handleUpdateQuestion = useCallback(
    (index, updated) => {
      setQuestions((prev) => {
        const copy = [...prev];
        copy[index] = updated;
        return copy;
      });
    },
    []
  );

  const handleDeleteQuestion = useCallback((index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearForm = useCallback(() => {
    setQuestions([]);
    setSubmitted(null);
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const sourceIndex = result.source.index;
      const destIndex = result.destination.index;
      if (sourceIndex === destIndex) return;

      setQuestions((prev) => {
        const updated = Array.from(prev);
        const [moved] = updated.splice(sourceIndex, 1);
        updated.splice(destIndex, 0, moved);
        return updated;
      });
    },
    []
  );

  const handleSubmit = useCallback(() => {
    const numbered = assignNumbers(questions);
    setSubmitted(numbered);
  }, [questions]);

  const numberedQuestions = assignNumbers(questions);

  return (
    <div className="form-builder">
      <h2>Dynamic Nested Question Form Builder</h2>
      <div className="actions">
        <button onClick={handleAddParent}>Add New Question</button>
        <button onClick={handleSubmit} disabled={questions.length === 0}>
          Submit Form
        </button>
        <button onClick={handleClearForm}>Clear Form</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="parent-questions">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="questions-list"
            >
              {numberedQuestions.map((q, index) => (
                <Draggable key={q.id} draggableId={q.id} index={index}>
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      className="draggable-question"
                    >
                      <NestedQuestion
                        question={q}
                        onUpdate={(updated) => handleUpdateQuestion(index, updated)}
                        onDelete={() => handleDeleteQuestion(index)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {submitted && (
        <div className="submission-view">
          <h3>Submitted Questions</h3>
          <SubmissionList questions={submitted} />
        </div>
      )}
    </div>
  );
}

function SubmissionList({ questions }) {
  return (
    <ul className="submission-list">
      {questions.map((q) => (
        <li key={q.id}>
          <div className="submission-item">
            <span className="submission-number">{q.number}</span>
            <span className="submission-text">{q.text || '(empty question)'}</span>
            {q.type && <span className="submission-type">[{q.type}]</span>}
          </div>
          {q.children && q.children.length > 0 && (
            <SubmissionList questions={q.children} />
          )}
        </li>
      ))}
    </ul>
  );
}


