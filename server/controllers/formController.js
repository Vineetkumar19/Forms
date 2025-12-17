let formState = [];

exports.getForm = (req, res) => {
  res.json(formState);
};

exports.saveForm = (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({ message: 'Form data must be an array of questions' });
  }
  formState = data;
  res.status(200).json({ message: 'Form saved successfully' });
};


