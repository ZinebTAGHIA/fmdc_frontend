import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axios from "../api/axios";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import "./styles/form.css";
import { Link } from "react-router-dom";
import { Panel } from "primereact/panel";
import "./styles/form.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const AddGroup = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/professors`)
      .then((response) => {
        setProfessors(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const validate = (data) => {
    let errors = {};
    if (!data.code) {
      errors.code = "Code est obligatoire.";
    }
    if (!data.year) {
      errors.year = "Année est obligatoire.";
    }
    if (!data.professor) {
      errors.professor = "Professeur est obligatoire.";
    }
    return errors;
  };

  const onSubmit = (data, form) => {
    console.log(data);
    setFormData(data);
    if (data) {
      axios
        .post(`/api/groups`, {
          code: data.code,
          year: data.year,
          professor: {
            id: data.professor,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
      setShowMessage(true);
    }
    form.restart();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
  return (
    <div>
      <main>
        <h1 className="title"> Ajouter un groupe </h1>
        <div style={{ marginBottom: 40 }}>
          <ul className="breadcrumbs">
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li className="divider">/</li>
            <li>
              <a href="#" className="active">
                Ajouter un groupe
              </a>
            </li>
          </ul>
        </div>
        <div className="form-container">
          <Panel header="Formulaire">
            <div className="form">
              <Dialog
                visible={showMessage}
                onHide={() => setShowMessage(false)}
                position="top"
                footer={dialogFooter}
                showHeader={false}
                breakpoints={{ "960px": "80vw" }}
                style={{ width: "30vw" }}
              >
                <div className="flex align-items-center flex-column pt-6 px-3">
                  <i
                    className="pi pi-check-circle"
                    style={{ fontSize: "5rem", color: "var(--green-500)" }}
                  ></i>
                  <h5>Groupe créé avec succès!</h5>
                </div>
              </Dialog>
              <div className="flex justify-content-center">
                <div className="card">
                  <Form
                    onSubmit={onSubmit}
                    initialValues={{
                      code: "",
                      year: "",
                      professor: "",
                    }}
                    validate={validate}
                    render={({ handleSubmit }) => (
                      <form onSubmit={handleSubmit} className="p-fluid">
                        <Field
                          name="code"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="code"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="code"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Code*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="year"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="year"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="year"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Année*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="professor"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <Dropdown
                                  id="professor"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                  options={professors.map((professor) => {
                                    return {
                                      label:
                                        professor.lastName +
                                        " " +
                                        professor.firstName,
                                      value: professor.id,
                                    };
                                  })}
                                />
                                <label
                                  htmlFor="professor"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Professeur*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Button
                          type="submit"
                          label="Enregistrer"
                          className="mt-2"
                        />
                      </form>
                    )}
                  />
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
};

export default AddGroup;
