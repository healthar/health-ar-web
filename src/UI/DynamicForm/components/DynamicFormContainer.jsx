import React from "react";
import "./DynamicForm.scss";
import { isEqual } from "lodash";
import { dynamicFormMaker } from "./DynamicFormMaker";
import { isFieldValid } from "../utilities/validation";
import {
  _getDefaultFormData,
  _handleNewQuestions,
  _toggleValueInArray,
  _searchForDataBy,
  _determineSubmitBtnState
} from "../utilities/formMethods";
import {
  _initialize
} from "../utilities/initialize";
import {
  _mergeWithPersistedData,
  _saveStateToLocalStorage,
  _getFromLocalStorage
} from "../utilities/localStorage";
import { SubmitBtn, EditableModeControls } from "./DynamicFormMaker/FormBtns";
import { SubmitBtnState } from "../utilities/types";

class DynamicFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form_data: {},
      questions: [],
      fields_is_valid: {},
      editable: true,
      editableMode: false
    };
  }

  componentDidMount() {
    const {
      initialData,
      purpose,
      questions,
    } = this.props;
    const state = { questions };

    const persistence = _getFromLocalStorage(purpose);
    if (persistence) {
      return this.setState(
        _mergeWithPersistedData(state, persistence, initialData)
      );
    } 
    let new_state = _initialize(this.props);
    return this.setState(new_state);
  }

  setInitialValues = (questions, initialData) => {
    let form_data = _getDefaultFormData(questions);
    if (initialData) {
      form_data = { ...form_data, ...initialData };
    }
    this.setState({ form_data });
  };

  componentDidUpdate(prevProps) {
    // when the form_data is updated from onFormChange
    const { form_data, fields_is_valid } = this.state;
    // or it receives new questions (for multi-question sets)
    const { purpose, questions } = this.props;

    _saveStateToLocalStorage(form_data, fields_is_valid, purpose || "form_data");

    // update form_data when a new question set is introduced
    // handles cases where multiple question sets may be introduced by
    // the DF Wrapper managing the DF Container
    if (!isEqual(questions, prevProps.questions)) {
      // only update if question set changes, performance of deep equal?
      const new_form_data = _handleNewQuestions(questions, form_data);
      this.setState({ form_data: new_form_data, questions });
    }
  }

  /**
   * updates 'form_data' in state
   * - calls onValidate(input_type, value, minlength, maxlength)
   *   - true: invalid field -> disable submit
   *   - false: valid field
   * - calls onInputChange(field_name, value, form_data)
   *   - observation only
   * - toggles or sets response value for 'question'
   */
  _handleInputChange = ({ currentTarget, min, max, value_type }) => {
    const { name, value, type } = currentTarget;

    const form_data = { ...this.state.form_data };
    const fields_is_valid = { ...this.state.fields_is_valid };

    const { onInputChange, onValidate } = this.props;

    const QA_Object = _searchForDataBy(
      "field_name",
      name,
      this.props.questions
    );
    const optional = QA_Object.optional;
    const inputType = QA_Object.input_type;
    // provides observational window into form data
    // no control over behavior at this time
    onInputChange && onInputChange(name, value, form_data);

    if (type === 'checkbox') {
      form_data[name] = _toggleValueInArray(form_data[name], value, max);
    } else if (type === 'submit' && inputType.indexOf("_toggle") !== -1) {
      form_data[name] = form_data[name] === value_type ? "" : value_type
    } else {
      form_data[name] = value;
    }

    console.log(QA_Object)
    // const validateField = onValidate || isFieldValid;
    // fields_is_valid[`${name}_is_valid`] = optional ? true : validateField(
    //   type,
    //   form_data[name],
    //   min,
    //   max,
    //   optional
    // );

    this.setState({ form_data, fields_is_valid });
  };

  /**
   * calls DynamicFormMaker()
   * - creates form Question components for each 'question'
   */
  renderInputs = () =>
    dynamicFormMaker(
      this.state.questions,
      this.state.form_data,
      this._handleInputChange,
      this.props.customComponents,
      this.state.editable
    );

  toggleEdit = () => {
    let { editable, form_data } = this.state;
    console.log(form_data);
    if (editable) {
      this.props.onSubmit(form_data);
    }
    this.setState({ editable: !this.state.editable });
  };

  cancelEdit = e => {
    e.preventDefault();
    this.setInitialValues(this.props.questions, this.props.initialData);
    this.setState({ editable: false });
  };

  render() {
    const { editable, editableMode, form_data, fields_is_valid } = this.state;
    let submitBtnIsEnabled = true
      // _determineSubmitBtnState(fields_is_valid) === SubmitBtnState.ENABLED;

    let renderSubmitBtn = !editableMode ? (
      <SubmitBtn
        form_data={form_data}
        disabled={!submitBtnIsEnabled}
        onSubmit={this.props.onSubmit}
        btnText={this.props.btnText}
        horizontal={this.props.horizontal}
        onCancel={this.props.onCancel}
      />
    ) : (
      <EditableModeControls
        editable={editable}
        disabled={!submitBtnIsEnabled}
        deleteItem={this.props.onDelete}
        toggleEdit={this.toggleEdit}
        cancelEdit={this.cancelEdit}
      />
    );

    return (
      <>
        {this.renderInputs()}
        {renderSubmitBtn}
      </>
    );
  }
}

export default DynamicFormContainer;
