
interface InputFieldProps {
    label: string;
    type: "text" | "password";
    id: string;
    value: string;
    onChange: Function;
    error: string;
  }

  const InputField: React.FC<InputFieldProps> = ({ label, type, id, value, onChange, error }) => {  
    return (
      <div style={{ margin: 5 }}>
        <label>{label}</label><br />
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 pr-10 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          } transition-colors`}
          style={{ width: '100%' }}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };
  
  export default InputField;
  