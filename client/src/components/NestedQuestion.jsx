import React, { useCallback } from 'react';
import Question from './Question';

export default function NestedQuestion({ question, onUpdate, onDelete }) {
  const handleQuestionChange = useCallback(
    (updated) => {
      onUpdate({ ...updated, children: question.children || [] });
    },
    [onUpdate, question]
  );

  const handleAddChild = useCallback(() => {
    const newChild = {
      id: Date.now().toString(),
      text: '',
      type: '',
      answer: null,
      children: [],
    };
    onUpdate({ ...question, children: [...(question.children || []), newChild] });
  }, [onUpdate, question]);

  const handleChildUpdate = useCallback(
    (index, updatedChild) => {
      const children = [...(question.children || [])];
      children[index] = updatedChild;
      onUpdate({ ...question, children });
    },
    [onUpdate, question]
  );

  const handleChildDelete = useCallback(
    (index) => {
      const children = [...(question.children || [])];
      children.splice(index, 1);
      onUpdate({ ...question, children });
    },
    [onUpdate, question]
  );

  return (
    <div className="nested-question">
      <Question
        question={question}
        onChange={handleQuestionChange}
        onAddChild={handleAddChild}
        onDelete={onDelete}
      />
      {question.children && question.children.length > 0 && (
        <div className="nested-children">
          {question.children.map((child, index) => (
            <NestedQuestion
              key={child.id}
              question={child}
              onUpdate={(updatedChild) => handleChildUpdate(index, updatedChild)}
              onDelete={() => handleChildDelete(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}


