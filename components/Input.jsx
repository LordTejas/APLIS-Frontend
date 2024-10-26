const Input = ({ id, label, type = 'text', placeholder, className, name, value, onChange }) => {
  return (
    <label
      htmlFor={id}
      className={`relative block rounded-md border border-gray-200 shadow-sm focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 ${className}`}
    >
      <input
        type={type}
        id={id}
        name={name}
        className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      <span
        className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
      >
        {label}
      </span>
    </label>
  );
};

export default Input;
