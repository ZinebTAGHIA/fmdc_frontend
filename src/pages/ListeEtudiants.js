import React, { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Link } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Field, Form } from "react-final-form";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";
import "./styles/list.css";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";

const ListeEtudiants = (props) => {
  const [data, setData] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [groups, setGroups] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({});
  const [selectGroups, setSelectGroups] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSelectGroups(
      currentStudent.groups
        ? currentStudent.groups.map((group) => group.id)
        : ""
    );
  }, [currentStudent]);

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

  useEffect(() => {
    if (props.user && props.user.id) {
      axios
        .get(`/api/professors/professor/${props.user.id}/students`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {});
    }
  }, [props.user]);

  const getSeverity = () => {
    return "info";
  };
  const roleBodyTemplate = (data) => {
    return data.groups.map((group) => (
      <Tag value={group.code} severity={getSeverity()} rounded />
    ));
  };
  const operationsBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="card flex justify-content-center">
          <Dialog
            header="Modifier un étudiant"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            <div className="form">
              <div
                className="flex justify-content-center"
                style={{ justifyContent: "center" }}
              >
                <div className="card">
                  <Form
                    onSubmit={onSubmit}
                    initialValues={{
                      lastName: currentStudent ? currentStudent.lastName : "",
                      firstName: currentStudent ? currentStudent.firstName : "",
                      number: currentStudent ? currentStudent.number : "",
                      groups: "",
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
          </Dialog>
        </div>
        <div className="card flex justify-content-between">
          <Button
            onClick={() => confirm1(rowData.id)}
            icon="bx bx-trash"
            label="Supprimer"
            className="mr-2"
            severity="danger"
            style={{ marginRight: 20 }}
          ></Button>
          <Button
            icon="bx bx-edit-alt"
            label="Modifier"
            onClick={() => {
              setCurrentStudent(rowData);
              setVisible(true);
            }}
          ></Button>
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
  };

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";

    return (
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={value || ""}
          onChange={(e) => onGlobalFilterChange(e)}
          placeholder="Global Search"
        />
      </span>
    );
  };

  const header = renderHeader();

  const acceptFunc = (id) => {
    axios
      .delete(`/api/students/${id}`)
      .then((response) => {
        axios
          .get(`/api/professors/professor/${props.user.id}/students`)
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {});

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Etudiant supprimé.",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Erreur",
          detail: "Cet étudiant ne peut pas être supprimé !",
          life: 3000,
        });
      });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejeté",
      detail: "Suppression annulée.",
      life: 3000,
    });
  };

  const confirm1 = (id) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir supprimer cet étudiant?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => acceptFunc(id),
      reject,
    });
  };

  const onSubmit = (data, form) => {
    data.groups = selectGroups;
    setFormData(data);
    if (data) {
      axios
        .put(`/api/students/${currentStudent.id}`, {
          lastName: data.lastName,
          firstName: data.firstName,
          number: data.number,
          groups: data.groups.map((id) => {
            return { id: id };
          }),
        })
        .then((response) => {
          axios
            .get(`/api/professors/professor/${props.user.id}/students`)
            .then((response) => {
              setData(response.data);
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    }
    setSelectGroups([]);
    setVisible(false);
    setShowMessage(true);
  };

  const validate = (data) => {
    let errors = {};
    data.groups = selectGroups;
    if (!data.lastName) {
      errors.lastName = "Nom est obligatoire.";
    }
    if (!data.firstName) {
      errors.firstName = "Prénom est obligatoire.";
    }
    if (!data.number) {
      errors.number = "Numéro est obligatoire.";
    }
    return errors;
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
        {!data ? (
          <ProgressSpinner />
        ) : (
          <>
            <Dialog
              visible={showMessage}
              onHide={() => setShowMessage(false)}
              position="top"
              footer={dialogFooter}
              showHeader={false}
              breakpoints={{ "960px": "80vw" }}
              style={{ width: "30vw" }}
            >
              <div
                className="flex align-items-center flex-column pt-6 px-3"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <i
                  className="pi pi-check-circle"
                  style={{ fontSize: "5rem", color: "var(--green-500)" }}
                ></i>
                <h5>Etudiant Modifié avec succès!</h5>
              </div>
            </Dialog>
            <h1 className="title">Etudiants</h1>
            <ul className="breadcrumbs">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li className="divider">/</li>
              <li>
                <a href="#" className="active">
                  Liste des étudiants
                </a>
              </li>
            </ul>
            <Toast ref={toast} />
            <ConfirmDialog />
            <DataTable
              value={data}
              header={header}
              filters={filters}
              paginator
              rows={10}
              emptyMessage="Aucun étudiant trouvée."
            >
              <Column field="id" header="ID" sortable />
              <Column field="lastName" header="Nom" />
              <Column field="firstName" header="Prénom" />
              <Column field="groups" header="Groupes" body={roleBodyTemplate} />
              <Column
                field="operations"
                header="Opérations"
                body={(rowData) => operationsBodyTemplate(rowData)}
              />
            </DataTable>
          </>
        )}
      </main>
    </div>
  );
};

export default ListeEtudiants;
