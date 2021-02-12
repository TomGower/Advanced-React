import { useState, useEffect } from 'react';

export default function useForm(initialState = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initialState);
  const initialValues = Object.values(initialState).join('');

  useEffect(() => {
    setInputs(initialState);
  }, [initialValues]);

  function handleChange(e) {
    let { value, name, type } = e.target;

    if (type === 'number') value = +value;
    if (type === 'file') {
      [value] = e.target.files;
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initialState);
  }

  function clearForm() {
    const blankState = Object.entries(inputs).map(([key, value]) => [key, '']);
    setInputs(Object.fromEntries(blankState));
  }

  return { inputs, handleChange, resetForm, clearForm };
}
