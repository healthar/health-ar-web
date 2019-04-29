import React from "react";

export default (
    { input_type, field_name, minlength, maxlength, placeholder },
    onFormChange,
    form_data,
    editable
) => {
    return (
        <div className='toggle-switch-container'>
        <button
            name={field_name}
            type={input_type}
            value={form_data[field_name]}
            className={form_data[field_name] === "positive" ? "toggle-yes" : "toggle-neutral"}
            onClick={({ currentTarget }) => onFormChange({ currentTarget, value_type: "positive" })}
        >
            <i className="fas fa-check"></i>
        </button>
        <button
            name={field_name}
            type={input_type}
            value={form_data[field_name]}
            className={form_data[field_name] === "negative" ? "toggle-no" : "toggle-neutral"}
            onClick={({ currentTarget }) => onFormChange({ currentTarget, value_type: "negative" })}
        >
            <i className="fas fa-times"></i>
        </button>
    </div>
    )
}
      
