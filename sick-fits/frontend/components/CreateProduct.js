import useForm from '../lib/useForm';

export default function CreateProduct() {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    name: 'nice short',
    price: 12345,
    description: 'this is the best short',
  });

  return (
    <form>
      <label htmlFor="name">
        Name:
        <input
          type="text"
          id="name"
          name="name"
          placeholder="name"
          value={inputs.name}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="price">
        Price:
        <input
          type="number"
          id="price"
          name="price"
          placeholder="price"
          value={inputs.price}
          onChange={handleChange}
        />
      </label>
      <button onClick={clearForm} type="button">
        Clear Form
      </button>
      <button onClick={resetForm} type="button">
        Reset Form
      </button>
    </form>
  );
}
