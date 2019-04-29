import React from "react";

export default (
    { input_type, field_name, minlength, maxlength, placeholder },
    onFormChange,
    form_data,
    editable
) => {
    console.log(form_data)
    return (
        <div className='toggle-switch-container'>
        <button
            name={field_name}
            value={form_data[field_name]}
            className={form_data[field_name] === true ? "toggle-yes" : "toggle-neutral"}
            onClick={({ currentTarget }) => onFormChange({ currentTarget })}
        >
            <i className="fas fa-check"></i>
        </button>
        <button
            name={field_name}
            value={form_data[field_name]}
            className={form_data[field_name] === false ? "toggle-no" : "toggle-neutral"}
            onClick={({ currentTarget }) => onFormChange({ currentTarget })}
        >
            <i className="fas fa-times"></i>
        </button>
    </div>
    )
}
      
