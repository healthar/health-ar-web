import React from "react";
import './FormBtns.scss';

export const SubmitBtn = ({ form_data, disabled, onSubmit, btnText, horizontal, onCancel }) => {
  const renderSubmitBtn = () => (
    <input
    className={disabled ? "form-btn--disabled" : "form-btn"}
    type="submit"
    value={btnText || "Submit"}
    disabled={disabled}
    onClick={e => {
      e.preventDefault();
      onSubmit(form_data);
    }}
  />
  )

  const renderCancelBtn = () => (
    <button className="btn--cancel" onClick={() => onCancel()}>
            Cancel
      </button>
  )


  const renderBtnRow = () => (
    <div className='btn-row'>
      {renderCancelBtn()}
      {renderSubmitBtn()}
    </div>
  )

  
  return (
    <React.Fragment>
      {horizontal && <hr className="form-hline" />}
      { onCancel ? renderBtnRow() : renderSubmitBtn() }
    </React.Fragment>
  );
};

export const EditableModeToggleBtn = ({ editable, disabled, toggleEdit }) => (
  <input
    className={editable ? "form-btn--edit" : "form-btn--save"}
    type="submit"
    value={editable ? "Save Citation" : "Edit"}
    disabled={disabled}
    onClick={e => {
      e.preventDefault();
      toggleEdit();
    }}
  />
);
export class EditableModeButtonRow extends React.Component {
  render() {
    let { deleteItem, cancelEdit } = this.props;
    return (
      <div className='editable-mode--controls'>
        <button className="form-btn--delete" onClick={e => deleteItem(e)}>
          Delete Citation
        </button>
        <button className="form-btn--cancel" onClick={e => cancelEdit(e)}>
          Cancel
        </button>
        {this.props.children}
      </div>
    );
  }
}

export const EditableModeControls = ({
  editable,
  disabled,
  deleteItem,
  toggleEdit,
  cancelEdit
}) => {
  return editable ? (
    <EditableModeButtonRow deleteItem={deleteItem} cancelEdit={cancelEdit}>
      <EditableModeToggleBtn
        editable={editable}
        disabled={disabled}
        toggleEdit={toggleEdit}
      />
    </EditableModeButtonRow>
  ) : (
      <EditableModeToggleBtn
        editable={editable}
        disabled={disabled}
        toggleEdit={toggleEdit}
      />
    );
};
