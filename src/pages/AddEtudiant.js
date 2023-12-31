import React, { useEffect, useRef, useState } from "react";
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
import { Password } from "primereact/password";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";

const AddEtudiant = (props) => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [groups, setGroups] = useState([]);
  const [selectGroups, setSelectGroups] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    if (props.user && props.user.id) {
      axios
        .get(`/api/professors/professor/${props.user.id}/groups`)
        .then((response) => {
          setGroups(response.data);
        })
        .catch((error) => {});
    }
  }, [props.user]);

  const validate = (data) => {
    let errors = {};
    data.groups = selectGroups;
    if (!data.lastName) {
      errors.lastName = "Nom est obligatoire.";
    }
    if (!data.firstName) {
      errors.firstName = "Prénom est obligatoire.";
    }
    if (!data.userName) {
      errors.userName = "Username est obligatoire.";
    }
    if (!data.number) {
      errors.number = "Numéro est obligatoire.";
    }
    if (!data.password) {
      errors.password = "Password est obligatoire.";
    }
    if (!data.groups || data.groups.length === 0) {
      errors.groups = "Groupes est obligatoire.";
    }
    if (!data.email) {
      errors.email = "Email est obligatoire.";
    }
    if (data.email) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
        errors.email = "Adresse email invalide. E.g. example@email.com";
      }
    }
    return errors;
  };

  const onSubmit = (data, form) => {
    data.groups = selectGroups;
    setFormData(data);
    if (data) {
      axios
        .post(`/api/students`, {
          lastName: data.lastName,
          firstName: data.firstName,
          number: data.number,
          groups: data.groups.map((id) => {
            return { id: id };
          }),
          email: data.email,
          userName: data.userName,
          password: data.password,
        })
        .then((response) => {
          setShowMessage(true);
          setSelectGroups([]);
          form.restart();
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Erreur",
            detail: "Email ou Username déjà utilisé.",
            life: 3000,
          });
        });
    }
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
        <Toast ref={toast} />
        <h1 className="title"> Ajouter un étudiant </h1>
        <div style={{ marginBottom: 40 }}>
          <ul className="breadcrumbs">
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li className="divider">/</li>
            <li>
              <a href="#" className="active">
                Ajouter un étudiant
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
                  <h5>Etudiant créé avec succès!</h5>
                </div>
              </Dialog>
              <div className="flex justify-content-center">
                <div className="card">
                  <Form
                    onSubmit={onSubmit}
                    initialValues={{
                      lastName: "",
                      firstName: "",
                      number: "",
                      email: "",
                      userName: "",
                      groups: "",
                      password: "",
                    }}
                    validate={validate}
                    render={({ handleSubmit }) => (
                      <form onSubmit={handleSubmit} className="p-fluid">
                        <Field
                          name="lastName"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="lastName"
                                  {...input}
                                  autoFocus
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="lastName"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Nom*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="firstName"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="firstName"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="firstName"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Prénom*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="number"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="number"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="number"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Numéro*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="groups"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <MultiSelect
                                  id="groups"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                  value={selectGroups}
                                  options={groups.map((group) => {
                                    return {
                                      label: group.code,
                                      value: group.id,
                                    };
                                  })}
                                  onChange={(e) => setSelectGroups(e.value)}
                                />
                                <label
                                  htmlFor="groups"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Groupes*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="email"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText
                                  id="email"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="email"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Email*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="userName"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText
                                  id="userName"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="userName"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Username*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Field
                          name="password"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <Password
                                  id="password"
                                  {...input}
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="password"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Password
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

export default AddEtudiant;
