import React, { useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import Dropdown from "./Dropdown";
import Checkbox from "./CheckBox";
import RadioButton from "./RadioButton";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  fieldContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  fieldLabel: {
    marginRight: "10px",
    fontWeight: "bold",
    minWidth: "100px",
  },
  fieldRemoveButton: {
    marginLeft: "10px",
    cursor: "pointer",
    padding: "5px 10px",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  selectField: {
    margin: "10px 0",
    padding: "5px",
  },
  optionsContainer: {
    marginBottom: "10px",
  },
  optionsInput: {
    marginRight: "10px",
  },
  optionsButton: {
    padding: "5px 10px",
    backgroundColor: "#5bc0de",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#5cb85c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const Form = () => {
  const [formFields, setFormFields] = useState([]);
  const [tempOptions, setTempOptions] = useState("");
  const [customValue, setCustomValue] = useState("");

  const addField = (userType) => {
    let newField;
    switch (userType) {
      case "text":
        newField = {
          type: "text",
          label: "Text Field",
          value: "",
          component: (
            <TextInput
              label="Text Field"
              onChange={(value) => handleFieldChange("text", value)}
            />
          ),
        };
        break;
      case "textarea":
        newField = {
          type: "textarea",
          label: "Text Area",
          value: "",
          component: (
            <TextArea
              label="Text Area"
              onChange={(value) => handleFieldChange("textarea", value)}
            />
          ),
        };
        break;
      case "dropdown":
        newField = {
          type: "dropdown",
          label: "Dropdown",
          options: [],
          value: "",
          component: (
            <Dropdown
              label="Dropdown"
              options={formFields[formFields.length - 1]?.options || []}
              addOptions={addOptions}
              onChange={(value) => handleFieldChange("dropdown", value)}
            />
          ),
        };
        break;
      case "checkbox":
        newField = {
          type: "checkbox",
          label: "Checkbox",
          value: false,
          customValue: "",
          component: (
            <Checkbox
              label="Checkbox"
              onChange={(value) => handleFieldChange("checkbox", value)}
              onCustomChange={(value) => setCustomValue(value)}
            />
          ),
        };
        break;
      case "radio":
        newField = {
          type: "radio",
          label: "Radio Buttons",
          options: ["Option A", "Option B"],
          value: "",
          customValue: "",
          component: (
            <RadioButton
              label="Radio Buttons"
              options={["Option A", "Option B"]}
              onChange={(value) => handleFieldChange("radio", value)}
              onCustomChange={(value) => setCustomValue(value)}
            />
          ),
        };
        break;
      default:
        break;
    }
    setFormFields([...formFields, newField]);
  };

  const removeField = (index) => {
    const updatedFormFields = [...formFields];
    updatedFormFields.splice(index, 1);
    setFormFields(updatedFormFields);
  };

  const addOptions = (options) => {
    setFormFields((prevFormFields) => {
      const updatedFormFields = [...prevFormFields];
      const lastField = updatedFormFields.pop();
      lastField.options = options;
      updatedFormFields.push(lastField);
      return updatedFormFields;
    });
  };

  const handleFieldChange = (fieldType, value) => {
    setFormFields((prevFormFields) => {
      const updatedFormFields = [...prevFormFields];
      const lastField = updatedFormFields.pop();
      lastField.value = value;
      updatedFormFields.push(lastField);
      return updatedFormFields;
    });
  };

  const extractFormFields = () => {
    // Extract necessary data for serialization
    return formFields.map(({ type, label, options, value, customValue }) => ({
      type,
      label,
      options,
      value,
      customValue,
    }));
  };

  const handleSave = () => {
    // Save form configuration as JSON with entered values
    const jsonConfig = JSON.stringify(extractFormFields(), null, 2);

    // Download JSON file
    const blob = new Blob([jsonConfig], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formConfig.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <form>
        {formFields.map((field, index) => (
          <div key={index} style={styles.fieldContainer}>
            <div style={{ flex: 1 }}>
              <label style={styles.fieldLabel}>{field.label}:</label>
              {field.component}
              {field.type === "checkbox" && (
                <input
                  type="text"
                  placeholder="Enter custom value"
                  value={field.customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                />
              )}
            </div>
            <button
              type="button"
              style={styles.fieldRemoveButton}
              onClick={() => removeField(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <div style={styles.selectField}>
          <label style={styles.fieldLabel}>Select Field Type:</label>
          <select onChange={(e) => addField(e.target.value)}>
            <option value="text">Text Field</option>
            <option value="textarea">Text Area</option>
            <option value="dropdown">Dropdown</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio Buttons</option>
          </select>

          {formFields.length > 0 &&
            formFields[formFields.length - 1]?.type === "dropdown" && (
              <div style={styles.optionsContainer}>
                <label style={styles.fieldLabel}>
                  Enter Options (comma-separated):
                </label>
                <input
                  type="text"
                  style={styles.optionsInput}
                  onChange={(e) => setTempOptions(e.target.value)}
                  value={tempOptions}
                />
                <button
                  type="button"
                  style={styles.optionsButton}
                  onClick={() =>
                    addOptions(
                      tempOptions.split(",").map((option) => option.trim())
                    )
                  }
                >
                  Confirm Options
                </button>
              </div>
            )}
        </div>

        <button type="button" style={styles.saveButton} onClick={handleSave}>
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default Form;
