import React, { useCallback } from 'react';

const QUESTION_TYPES = [
  { value: 'short', label: 'Short Answer' },
  { value: 'boolean', label: 'True / False' },
];

export default function Question({
  question,
  onChange,
  onAddChild,
  onDelete,
}) {
  const handleTextChange = useCallback(
    (e) => {
      onChange({ ...question, text: e.target.value });
    },
    [onChange, question]
  );

  const handleTypeChange = useCallback(
    (e) => {
      const type = e.target.value;
      const updated = {
        ...question,
        type,
        answer: type === 'boolean' ? null : null,
      };
      onChange(updated);
    },
    [onChange, question]
  );

  const handleAnswerChange = useCallback(
    (e) => {
      const value = e.target.value === 'true';
      onChange({ ...question, answer: value });
    },
    [onChange, question]
  );

  return (
    <div className="question">
      <div className="question-header">
        <span className="question-number">{question.number}</span>
        <input
          type="text"
          className="question-input"
          placeholder="Enter question"
          value={question.text}
          onChange={handleTextChange}
        />
        <select
          className="question-type"
          value={question.type}
          onChange={handleTypeChange}
        >
          <option value="">Select type</option>
          {QUESTION_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      </div>

      {question.type === 'boolean' && (
        <div className="question-boolean">
          <label>
            <input
              type="radio"
              value="true"
              checked={question.answer === true}
              onChange={handleAnswerChange}
            />
            True
          </label>
          <label>
            <input
              type="radio"
              value="false"
              checked={question.answer === false}
              onChange={handleAnswerChange}
            />
            False
          </label>
        </div>
      )}

      {question.type === 'boolean' && question.answer === true && (
        <button className="add-child-btn" onClick={onAddChild}>
          Add Child Question
        </button>
      )}
    </div>
  );
}


