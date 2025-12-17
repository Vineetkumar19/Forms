// Recursively assign hierarchical question numbers like Q1, Q1.1, Q1.1.1
export function assignNumbers(questions, prefix = '') {
  return questions.map((q, index) => {
    const number = prefix ? `${prefix}.${index + 1}` : `Q${index + 1}`;
    const children = q.children && q.children.length ? assignNumbers(q.children, number) : [];
    return { ...q, number, children };
  });
}


